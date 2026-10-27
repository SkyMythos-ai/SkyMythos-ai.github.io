export const commercialNavigation = [
  {
    section: "product", label: "产品", description: "企业自己的 AI 工作能力",
    links: [
      ["product/", "产品总览", "从工作交付到方法复用"],
      ["product/work-delivery/", "完成工作", "组织目标、执行与人的确认"],
      ["product/methods/", "保留方法", "让经确认的经验参与下一次工作"],
      ["product/governance/", "使用与投入", "看清授权、运行与估算费用"],
      ["product/architecture/", "企业架构", "深入了解系统与接入边界"],
    ],
  },
  {
    section: "solutions", label: "解决方案", description: "从具体工作开始",
    links: [
      ["solutions/", "解决方案总览", "选择值得验证的第一项工作"],
      ["solutions/engineering/", "研发任务交付", "从需求到可审阅的产物"],
      ["solutions/team-reuse/", "团队方法复用", "让有效经验不只留在一次对话里"],
      ["solutions/enterprise-adoption/", "企业 AI 采用", "明确接入、验证与扩展的条件"],
    ],
  },
  { section: "security", label: "安全", route: "security/" },
  {
    section: "resources", label: "资源", description: "评估与深入了解",
    links: [
      ["resources/", "资源总览", "按评估阶段选择阅读资料"],
      ["resources/how-it-works/", "工作方式", "完整了解一项工作的交付与复用"],
      ["/zh/docs/", "产品文档", "产品操作与使用说明"],
      ["/zh/docs/getting-started/deployment/", "部署指南", "核对部署与接入前提"],
    ],
  },
] as const;
