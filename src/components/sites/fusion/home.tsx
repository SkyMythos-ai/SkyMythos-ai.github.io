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
import { getCapabilities, getQuestions } from "./content";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getDocsSource } from "@/lib/docs-source";
import styles from "./site.module.css";

function CapabilityIndex({ slugs, locale }: { slugs: string[]; locale: Locale }) {
  const capabilities = getCapabilities(locale);
  return (
    <div className={styles.capabilityIndex}>
      <span>{locale === "zh" ? "相关能力" : "Related capabilities"}</span>
      <div>
        {slugs.map((slug) => {
          const capability = capabilities.find((item) => item.slug === slug);
          return capability ? (
            <Link href={localizeHref(`/product/${slug}`, locale)} key={slug}>
              {capability.name}
              <ChevronRight size={14} />
            </Link>
          ) : null;
        })}
      </div>
    </div>
  );
}

export function FusionHome({ locale = "en" }: { locale?: Locale }) {
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const docsSource = getDocsSource(locale);
  const questions = getQuestions(locale);
  return (
    <SiteShell>
      <main id="main-content">
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1>
              {text("让 AI 完成工作，", "Let AI do the work.")}
              <br />
              <span>{text("让能力留在企业。", "Keep the capability.")}</span>
            </h1>
            <div className={styles.heroBottom}>
              <p className={styles.heroDescription}>
                {text("让数字员工交付成果，让有效经验沉淀为企业能力。", "AI employees deliver results. Useful experience becomes lasting team capability.")}
              </p>
              <div className={styles.heroActions}>
                <Link href={localizeHref("/poc", locale)} className={styles.primaryLink}>
                  {text("申请 POC", "Request a POC")} <ArrowRight size={16} />
                </Link>
                <Link href={localizeHref("/docs/getting-started", locale)} className={styles.textLink}>
                  {text("了解如何开始", "See how to start")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroProduct} id="product-demo">
            <ProductShowcase />
          </div>
          <div className={styles.container}>
            <div className={styles.productVocabulary} aria-label={text("产品工作空间", "Product workspace")}>
              <span>{text("一个工作空间，连接每一次工作", "One workspace for every piece of work")}</span>
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
            {text("工作向前推进，", "Move work forward. ")}
            <br className={styles.mobileBreak} />
            <span>{text("能力持续积累。", "Build capability as you go.")}</span>
          </h2>
          <p className={styles.manifesto}>
            {text("AI 的价值，不止是完成一次对话。", "AI can do more than finish a conversation. ")}
            <br className={styles.desktopBreak} />
            {text("把目标、数字员工与企业知识组织起来，", "Bring goals, AI employees and knowledge together. ")}
            <br className={styles.desktopBreak} />
            {text("让工作的结果和方法，成为团队共同的能力。", "Make the results and methods useful to your whole team.")}
          </p>
          <div className={styles.principles}>
            <div>
              <Workflow />
              <h3>{text("从目标到结果", "From goals to results")}</h3>
              <p>{text("把背景、执行过程与交付物放在一起，让工作有明确的完成标准。", "Keep context, execution and deliverables together, with clear criteria for completion.")}</p>
            </div>
            <div>
              <Layers3 />
              <h3>{text("从经验到方法", "From experience to methods")}</h3>
              <p>{text("整理值得复用的经验，经确认后成为数字员工后续工作的依据。", "Organize useful experience for review, then make it available to guide future work.")}</p>
            </div>
            <div>
              <LockKeyhole />
              <h3>{text("从个人到组织", "From individuals to teams")}</h3>
              <p>{text("按来源、授权与维护责任共享能力，保留清晰的使用边界。", "Share capabilities with clear sources, permissions and maintenance ownership.")}</p>
            </div>
          </div>
        </section>
        <section className={styles.storySection} id="work">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                {text("给出目标。", "Set the goal.")}
                <br />
                {text("让工作持续推进。", "Keep the work moving.")}
              </h2>
              <div>
                <p>
                  {text("围绕真实目标组织上下文，让数字员工调用工具、形成产物。过程清楚可见，交付有据可查，需要人确认的事项明确保留。", "Give AI employees the context to use tools and produce deliverables. Follow the process, inspect the evidence and keep human decisions explicit.")}
                </p>
                <Link className={styles.textLink} href={localizeHref("/product/skybot", locale)}>
                  {text("了解工作交付", "Explore work delivery")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <WorkDeliveryVisual />
            </div>
            <CapabilityIndex locale={locale} slugs={["skybot", "flows", "automations"]} />
          </div>
        </section>
        <section className={styles.storySection} id="employees">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                {text("经验，不止", "Experience that lasts")}
                <br />
                {text("留在这次对话。", "beyond the conversation.")}
              </h2>
              <div>
                <p>
                  {text("让有效的工作经验留下来。为数字员工组织职责、知识与技能，将经验整理成待确认的改进方案，让方法能够继续复用。", "Define responsibilities, knowledge and skills for AI employees. Turn useful experience into proposed improvements for review, so effective methods can be reused.")}
                </p>
                <Link className={styles.textLink} href={localizeHref("/product/employees", locale)}>
                  {text("了解数字员工", "Explore AI employees")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <EmployeeVisual />
            </div>
            <CapabilityIndex locale={locale} slugs={["employees", "knowledge"]} />
          </div>
        </section>
        <section className={styles.storySection} id="knowledge">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                {text("让知识有出处，", "Knowledge with sources.")}
                <br />
                {text("让工作有依据。", "Work with a foundation.")}
              </h2>
              <div>
                <p>
                  {text("将分散的项目事实、工作资料与长期决策，组织成可检索、可维护的知识。找到相关内容，也能回到来源原文，确认它是否适合当前工作。", "Organize project facts, working materials and lasting decisions into searchable, maintainable knowledge. Find relevant passages and return to their sources to check their fit.")}
                </p>
                <Link className={styles.textLink} href={localizeHref("/product/knowledge", locale)}>
                  {text("了解企业知识", "Explore enterprise knowledge")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <KnowledgeVisual />
            </div>
            <CapabilityIndex locale={locale} slugs={["knowledge", "environments"]} />
          </div>
        </section>
        <section
          className={`${styles.container} ${styles.governance}`}
          id="governance"
        >
          <div className={styles.sectionHeading}>
            <h2>
              {text("自主执行，", "Autonomous work.")}
              <br />
              {text("也有明确的边界。", "Clear boundaries.")}
            </h2>
            <div>
              <p>
                {text("在适合的环境中工作，用明确的授权连接模型、工具与企业资料。自动执行与人的判断相互配合，让团队知道哪些工作可推进、哪些决定要确认。", "Connect models, tools and enterprise materials with explicit permissions in a suitable environment. Keep it clear what can proceed and which decisions need confirmation.")}
              </p>
              <Link href={localizeHref("/product/environments", locale)} className={styles.textLink}>
                {text("了解环境与治理", "Explore environments & governance")} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <div className={styles.governanceLayout}>
            <div className={styles.boundaryList}>
              <article>
                <KeyRound />
                <div>
                  <h3>{text("连接与授权，分别管理", "Manage connections and permissions separately")}</h3>
                  <p>
                    {text("共享知识和方法，不意味着共享个人凭据。每一种连接都有自己的访问范围。", "Share knowledge and methods without sharing personal credentials. Each connection has its own access scope.")}
                  </p>
                </div>
              </article>
              <article>
                <Layers3 />
                <div>
                  <h3>{text("在明确的执行环境中工作", "Work in a defined environment")}</h3>
                  <p>
                    {text("按任务需要准备模型、工具和环境，并核对数据与外部连接的边界。", "Prepare models, tools and environments for the task, then review data and external connection boundaries.")}
                  </p>
                </div>
              </article>
              <article>
                <FileCheck2 />
                <div>
                  <h3>{text("结果与决策，保留依据", "Keep evidence for results and decisions")}</h3>
                  <p>
                    {text("执行完成、检查通过、人工验收与发布分别判断，让下一步行动有清楚的责任。", "Assess execution, checks, human acceptance and release separately, with clear responsibility for each next step.")}
                  </p>
                </div>
              </article>
            </div>
            <div className={styles.environmentPanel}>
              <div className={styles.environmentTop}>
                <span>
                  <LockKeyhole size={17} />
                  {text("研发工作环境", "Engineering environment")}
                </span>
                <small>{text("示例配置", "Example configuration")}</small>
              </div>
              <dl>
                <div>
                  <dt>{text("执行环境", "Execution environment")}</dt>
                  <dd>{text("隔离工作空间", "Isolated workspace")}</dd>
                </div>
                <div>
                  <dt>{text("模型服务", "Model service")}</dt>
                  <dd>{text("使用已授权连接", "Authorized connections")}</dd>
                </div>
                <div>
                  <dt>{text("项目知识", "Project knowledge")}</dt>
                  <dd>{text("按访问范围检索", "Search within access scope")}</dd>
                </div>
                <div>
                  <dt>{text("外部动作", "External actions")}</dt>
                  <dd>{text("按工作流程确认", "Confirmed by workflow")}</dd>
                </div>
                <div>
                  <dt>{text("交付检查", "Delivery checks")}</dt>
                  <dd>{text("产物与验证结果", "Artifacts and check results")}</dd>
                </div>
              </dl>
              <p>
                <Check size={15} /> {text("把人的判断，留在需要判断的地方。", "Keep human judgment where it is needed.")}
              </p>
            </div>
          </div>
        </section>
        <section className={`${styles.container} ${styles.resources}`}>
          <div className={styles.sectionLabelRow}>
            <h2>{text("从一次真实的工作开始", "Start with real work")}</h2>
            <Link href={localizeHref("/docs", locale)} className={styles.textLink}>
              {text("全部指南", "All guides")} <ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.guideList}>
            {["getting-started", "architecture", "deployment"]
              .map((slug) => docsSource.getPage([slug]))
              .filter((guide) => guide !== undefined)
              .map((guide, index) => (
                <Link href={localizeHref(guide.url, locale)} key={guide.url}>
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
                    {text("阅读指南", "Read the guide")} <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
          </div>
        </section>
        <PricingOverview locale={locale} />
        <section className={`${styles.container} ${styles.faq}`}>
          <h2>{text("你可能想了解", "Questions you may have")}</h2>
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
              {text("从你的业务场景，", "Start with your use case.")}
              <br />
              {text("开始一次 POC。", "Define a POC together.")}
            </h2>
            <p>{text("从具体目标、工作环境与验收标准出发，一起评估企业落地。", "Assess the fit around your goals, environment and acceptance criteria.")}</p>
            <div>
              <Link href={localizeHref("/poc", locale)} className={styles.primaryLink}>
                {text("申请 POC", "Request a POC")} <ArrowRight size={16} />
              </Link>
              <Link
                href={localizeHref("/docs/private-deployment", locale)}
                className={styles.secondaryLink}
              >
                {text("了解私有部署", "Explore private deployment")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
