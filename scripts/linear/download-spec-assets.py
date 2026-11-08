import json,subprocess,hashlib,concurrent.futures
from pathlib import Path
p=Path('docs/research/linear/specs.json');specs=json.loads(p.read_text());out=Path('public/sites/linear/specs');out.mkdir(parents=True,exist_ok=True)
urls={im['src'] for spec in specs.values() for im in spec['images'] if im.get('src')}
def save(url):
 name=url.split('/')[-1].split('?')[0];target=out/name
 r=subprocess.run(['curl','-L','-A','Mozilla/5.0','--retry','2','--max-time','40','--fail','--silent',url,'-o',str(target)],capture_output=True)
 if r.returncode: raise Exception(url+' '+r.stderr.decode())
 typ=subprocess.check_output(['file','-b',str(target)]).decode().strip();return url,{'local':'/sites/linear/specs/'+name,'bytes':target.stat().st_size,'type':typ}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: mapping=dict(pool.map(save,urls))
Path('docs/research/linear/specs-assets.json').write_text(json.dumps(mapping,indent=2))
specs=json.loads(p.read_text())
for spec in specs.values():
 for im in spec['images']:
  if im.get('src') in mapping: im.update(mapping[im['src']])
p.write_text(json.dumps(specs,indent=2));print('downloaded',len(mapping),'images')
