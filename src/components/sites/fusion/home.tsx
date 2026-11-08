import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCheck2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Workflow,
  Plus,
} from "lucide-react";
import { SiteShell } from "./site-shell";
import { PricingOverview } from "./pricing";
import {
  ProductShowcase,
  WorkDeliveryVisual,
  EmployeeVisual,
  KnowledgeVisual,
} from "./product-showcase";
import { capabilities, questions } from "./content";
import { docsSource } from "@/lib/docs-source";
import styles from "./site.module.css";

function CapabilityIndex({ slugs }: { slugs: string[] }) {
  return (
    <div className={styles.capabilityIndex}>
      <span>相关能力</span>
      <div>
        {slugs.map((slug) => {
          const capability = capabilities.find((item) => item.slug === slug);
          return capability ? (
            <Link href={`/product/${slug}`} key={slug}>
              {capability.name}
              <ChevronRight size={14} />
            </Link>
          ) : null;
        })}
      </div>
    </div>
  );
}

export function FusionHome() {
  return (
    <SiteShell>
      <main id="main-content">
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1>
              让 AI 完成工作，
              <br />
              <span>让能力留在企业。</span>
            </h1>
            <div className={styles.heroBottom}>
              <p className={styles.heroDescription}>
                让数字员工交付成果，让有效经验沉淀为企业能力。
              </p>
              <div className={styles.heroActions}>
                <Link href="/poc" className={styles.primaryLink}>
                  申请 POC <ArrowRight size={16} />
                </Link>
                <Link href="/docs/getting-started" className={styles.textLink}>
                  了解如何开始 <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroProduct} id="product-demo">
            <ProductShowcase />
          </div>
          <div className={styles.container}>
            <div className={styles.productVocabulary} aria-label="产品工作空间">
              <span>一个工作空间，连接每一次工作</span>
              <div>
                <span>SkyBot</span>
                <span>Projects</span>
                <span>Tasks</span>
                <span>Agents</span>
                <span>Automations</span>
                <span>Knowledge</span>
              </div>
            </div>
          </div>
        </section>
        <section className={`${styles.container} ${styles.intro}`}>
          <h2>
            工作向前推进，
            <br className={styles.mobileBreak} />
            <span>能力持续积累。</span>
          </h2>
          <p className={styles.manifesto}>
            AI 的价值，不止是完成一次对话。
            <br className={styles.desktopBreak} />
            把目标、数字员工与企业知识组织起来，
            <br className={styles.desktopBreak} />
            让工作的结果和方法，成为团队共同的能力。
          </p>
          <div className={styles.principles}>
            <div>
              <Workflow />
              <h3>从目标到结果</h3>
              <p>把背景、执行过程与交付物放在一起，让工作有明确的完成标准。</p>
            </div>
            <div>
              <Layers3 />
              <h3>从经验到方法</h3>
              <p>整理值得复用的经验，经确认后成为数字员工后续工作的依据。</p>
            </div>
            <div>
              <LockKeyhole />
              <h3>从个人到组织</h3>
              <p>按来源、授权与维护责任共享能力，保留清晰的使用边界。</p>
            </div>
          </div>
        </section>
        <section className={styles.storySection} id="work">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                给出目标。
                <br />
                让工作持续推进。
              </h2>
              <div>
                <p>
                  围绕真实目标组织上下文，让数字员工调用工具、形成产物。过程清楚可见，交付有据可查，需要人确认的事项明确保留。
                </p>
                <Link className={styles.textLink} href="/product/skybot">
                  了解工作交付 <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <WorkDeliveryVisual />
            </div>
            <CapabilityIndex slugs={["skybot", "flows", "automations"]} />
          </div>
        </section>
        <section className={styles.storySection} id="employees">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                经验，不止
                <br />
                留在这次对话。
              </h2>
              <div>
                <p>
                  让有效的工作经验留下来。为数字员工组织职责、知识与技能，将经验整理成待确认的改进方案，让方法能够继续复用。
                </p>
                <Link className={styles.textLink} href="/product/employees">
                  了解数字员工 <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <EmployeeVisual />
            </div>
            <CapabilityIndex slugs={["employees", "knowledge"]} />
          </div>
        </section>
        <section className={styles.storySection} id="knowledge">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                让知识有出处，
                <br />
                让工作有依据。
              </h2>
              <div>
                <p>
                  将分散的项目事实、工作资料与长期决策，组织成可检索、可维护的知识。找到相关内容，也能回到来源原文，确认它是否适合当前工作。
                </p>
                <Link className={styles.textLink} href="/product/knowledge">
                  了解企业知识 <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <KnowledgeVisual />
            </div>
            <CapabilityIndex slugs={["knowledge", "environments"]} />
          </div>
        </section>
        <section
          className={`${styles.container} ${styles.governance}`}
          id="governance"
        >
          <div className={styles.sectionHeading}>
            <h2>
              自主执行，
              <br />
              也有明确的边界。
            </h2>
            <div>
              <p>
                在适合的环境中工作，用明确的授权连接模型、工具与企业资料。自动执行与人的判断相互配合，让团队知道哪些工作可推进、哪些决定要确认。
              </p>
              <Link href="/product/environments" className={styles.textLink}>
                了解环境与治理 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <div className={styles.governanceLayout}>
            <div className={styles.boundaryList}>
              <article>
                <KeyRound />
                <div>
                  <h3>连接与授权，分别管理</h3>
                  <p>
                    共享知识和方法，不意味着共享个人凭据。每一种连接都有自己的访问范围。
                  </p>
                </div>
              </article>
              <article>
                <Layers3 />
                <div>
                  <h3>在明确的执行环境中工作</h3>
                  <p>
                    按任务需要准备模型、工具和环境，并核对数据与外部连接的边界。
                  </p>
                </div>
              </article>
              <article>
                <FileCheck2 />
                <div>
                  <h3>结果与决策，保留依据</h3>
                  <p>
                    执行完成、检查通过、人工验收与发布分别判断，让下一步行动有清楚的责任。
                  </p>
                </div>
              </article>
            </div>
            <div className={styles.environmentPanel}>
              <div className={styles.environmentTop}>
                <span>
                  <LockKeyhole size={17} />
                  研发工作环境
                </span>
                <small>示例配置</small>
              </div>
              <dl>
                <div>
                  <dt>执行环境</dt>
                  <dd>隔离工作空间</dd>
                </div>
                <div>
                  <dt>模型服务</dt>
                  <dd>使用已授权连接</dd>
                </div>
                <div>
                  <dt>项目知识</dt>
                  <dd>按访问范围检索</dd>
                </div>
                <div>
                  <dt>外部动作</dt>
                  <dd>按工作流程确认</dd>
                </div>
                <div>
                  <dt>交付检查</dt>
                  <dd>产物与验证结果</dd>
                </div>
              </dl>
              <p>
                <Check size={15} /> 把人的判断，留在需要判断的地方。
              </p>
            </div>
          </div>
        </section>
        <section className={`${styles.container} ${styles.resources}`}>
          <div className={styles.sectionLabelRow}>
            <h2>从一次真实的工作开始</h2>
            <Link href="/docs" className={styles.textLink}>
              全部指南 <ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.guideList}>
            {["getting-started", "architecture", "deployment"]
              .map((slug) => docsSource.getPage([slug]))
              .filter((guide) => guide !== undefined)
              .map((guide, index) => (
                <Link href={guide.url} key={guide.url}>
                  <div className={styles.guideArt} aria-hidden="true">
                    {index === 0 ? (
                      <Workflow />
                    ) : index === 1 ? (
                      <Layers3 />
                    ) : (
                      <FileCheck2 />
                    )}
                  </div>
                  <h3>{guide.data.title}</h3>
                  <p>{guide.data.description}</p>
                  <span>
                    阅读指南 <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
          </div>
        </section>
        <PricingOverview />
        <section className={`${styles.container} ${styles.faq}`}>
          <h2>你可能想了解</h2>
          <div>
            {questions.map((item) => (
              <details key={item.question} name="fusion-faq">
                <summary>
                  {item.question}
                  <span aria-hidden="true">
                    <Plus size={18} />
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>
              从你的业务场景，
              <br />
              开始一次 POC。
            </h2>
            <p>从具体目标、工作环境与验收标准出发，一起评估企业落地。</p>
            <div>
              <Link href="/poc" className={styles.primaryLink}>
                申请 POC <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs/private-deployment"
                className={styles.secondaryLink}
              >
                了解私有部署
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
