export const translations = {
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      openToRemote: "Open to remote roles",
      emailMe: "Email me",
    },
    about: {
      heading: "01. About",
    },
    skills: {
      heading: "02. Skills",
    },
    projects: {
      heading: "03. Projects & Contributions",
    },
    contact: {
      heading: "04. Contact",
      intro: "Feel free to reach out through any of the channels below.",
    },
    footer: {
      text: "Built with Next.js, deployed on Vercel.",
    },
  },
  pt: {
    nav: {
      about: "Sobre",
      skills: "Habilidades",
      projects: "Projetos",
      contact: "Contato",
    },
    hero: {
      openToRemote: "Aberto a vagas remotas",
      emailMe: "Enviar email",
    },
    about: {
      heading: "01. Sobre",
    },
    skills: {
      heading: "02. Habilidades",
    },
    projects: {
      heading: "03. Projetos & Contribuições",
    },
    contact: {
      heading: "04. Contato",
      intro:
        "Fique à vontade para entrar em contato por qualquer um dos canais abaixo.",
    },
    footer: {
      text: "Feito com Next.js, publicado na Vercel.",
    },
  },
} as const;

export type Translations = typeof translations.en;
