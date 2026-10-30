const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');

const product = path.resolve(__dirname, '../../../fusion-harness/components/console/web');
const gitRoot = path.resolve(product, '../../..');
const prefix = 'components/console/web/';
const sha = data => crypto.createHash('sha256').update(data).digest('hex');

function prepareSnapshot({baselineDir, kind}) {
  const provenance = JSON.parse(fs.readFileSync(path.join(baselineDir, 'source-provenance.json'), 'utf8'));
  const revision = provenance.sourceRevision;
  if (!/^[a-f0-9]{40}$/.test(revision) || !provenance.actualImports || !kind) throw Error('Invalid snapshot provenance');
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `fusion-${kind}-snapshot-`)));
  const root = path.resolve(dir, prefix);
  const cleanup = () => fs.rmSync(dir, {recursive:true, force:true});
  try {
    const archive = execFileSync('git', ['-C', gitRoot, 'archive', revision, prefix+'src'], {maxBuffer: 200*1024*1024});
    execFileSync('tar', ['-x', '-C', dir], {input:archive, maxBuffer: 200*1024*1024});
    fs.symlinkSync(path.join(product, 'node_modules'), path.join(root, 'node_modules'), 'dir');
    fs.copyFileSync(path.join(product, 'package.json'), path.join(root, 'package.json'));
    fs.mkdirSync(path.join(root, 'public'), {recursive:true});
    for (const name of ['logo-mark.svg','logo-wordmark.svg','logo-lockup.svg','logo-mark-dark.svg','logo-wordmark-dark.svg','logo-lockup-dark.svg']) {
      const baseline = path.join(baselineDir, name);
      if (!fs.existsSync(baseline)) throw Error(`Missing baseline asset ${name}`);
      fs.copyFileSync(baseline, path.join(root, 'public', name));
    }
    const recovered = {};
    for (const [name, expected] of Object.entries(provenance.actualImports)) {
      if (path.isAbsolute(name) || name.split('/').includes('..')) throw Error(`Invalid import path ${name}`);
      const local = path.join(product, name);
      let data, source;
      if (fs.existsSync(local) && sha(fs.readFileSync(local)) === expected) {data = fs.readFileSync(local); source = 'working-tree';}
      if (!data && name.startsWith('src/')) for (const rev of [revision, '72b1489f']) {
        try {const candidate = execFileSync('git', ['-C',gitRoot,'show',`${rev}:${prefix}${name}`], {maxBuffer:20*1024*1024, stdio:['ignore','pipe','ignore']}); if (sha(candidate) === expected) {data=candidate;source=`git:${rev}`;break;}} catch {}
      }
      const frozen = path.join(__dirname, 'frozen', expected+'.ts');
      if (!data && fs.existsSync(frozen) && sha(fs.readFileSync(frozen)) === expected) {data=fs.readFileSync(frozen);source='frozen';}
      if (!data) throw Error(`Cannot restore ${name} (${expected})`);
      if (name.startsWith('src/')) {const target=path.join(root,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data);}
      else if (sha(fs.readFileSync(path.join(root,name))) !== expected) throw Error(`External dependency changed: ${name}`);
      recovered[name] = {sha256:expected, source};
    }
    return {root, revision, provenance:{...provenance, snapshot:{kind,recovered}}, cleanup};
  } catch (error) {cleanup(); throw error;}
}
module.exports = {prepareSnapshot};
