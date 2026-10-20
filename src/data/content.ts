import { site } from "@/config/site";

// Todos os textos do site e os caminhos das fotos.
// As fotos ficam em assets/photos/ e são convertidas com npm run images.
// O caminho aqui é o nome do arquivo sem extensão, dentro de /images.

export type TreatmentId = "cervical-dtm" | "coluna-lombar" | "recuperacao-muscular" | "mobilidade";
export type RegionId = "mandibula" | "pescoco" | "ombro" | "costas" | "joelho" | "tornozelo";
export type TreatmentIcon = "mood-smile" | "armchair" | "barbell" | "stretching";

type Photo = { src: string; alt: string };

export const meta = {
  title: "BLL Fisioterapia | Fisioterapia em domicílio",
  description:
    "A BLL leva a fisioterapia até a sua casa: dor de cabeça tensional, DTM, dores no pescoço e nas costas e recuperação de quem treina.",
};

export const nav = {
  brandLabel: "BLL Fisioterapia, voltar ao início",
  brandName: "Fisioterapia",
  links: [
    { href: "#tratamentos", label: "Tratamentos" },
    { href: "#onde-doi", label: "Onde dói?" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#contato", label: "Contato" },
  ],
  cta: "Agendar",
};

export const hero = {
  badge: "Fisioterapia em domicílio",
  // A palavra em `struck` recebe o traço verde depois da entrada.
  title: { lines: ["Menos dor.", "Mais movimento."], struck: "dor" },
  subtitle:
    "A BLL leva a fisioterapia até a sua casa para tratar dor de cabeça tensional, DTM, dores no pescoço e nas costas e a recuperação de quem treina.",
  primaryCta: "Agendar avaliação pelo WhatsApp",
  secondaryCta: "Ver tratamentos",
  trust: [
    { icon: "certificate", text: `Fisioterapeuta com CREFITO ${site.responsible.crefito}` },
    { icon: "clipboard-check", text: "Avaliação na primeira visita" },
    { icon: "map-pin", text: `Atende em ${site.city} e região` },
  ],
  // Para trocar pela foto do Luis atendendo, mude só esta linha (veja o README).
  image: {
    src: "/images/hero",
    alt: "Fisioterapeuta alongando a perna de um paciente deitado na maca",
  } satisfies Photo,
  painCard: {
    title: "Onde dói?",
    text: "Toque e veja como a BLL pode ajudar.",
    regions: ["pescoco", "mandibula", "costas", "ombro", "joelho"] satisfies RegionId[],
  },
};

export const treatmentsSection = {
  title: "Tratamentos",
  text: "A BLL trata a dor e o que está causando ela, com sessões na sua casa.",
  // Contador da faixa de cards: "1 de 4".
  counterSeparator: "de",
  goalLabel: "Objetivo:",
  cta: "Agendar avaliação",
};

export const treatments: {
  id: TreatmentId;
  icon: TreatmentIcon;
  name: string;
  description: string;
  goal: string;
  image: Photo;
}[] = [
  {
    id: "cervical-dtm",
    icon: "mood-smile",
    name: "Cervical e DTM",
    description:
      "Para quem tem dor de cabeça tensional, pescoço travado ou dor ao mastigar e abrir a boca.",
    goal: "passar o dia sem dor de cabeça e mastigar sem desconforto.",
    image: {
      src: "/images/cervical-dtm",
      alt: "Fisioterapeuta orientando um paciente sentado na maca durante um alongamento",
    },
  },
  {
    id: "coluna-lombar",
    icon: "armchair",
    name: "Coluna e lombar",
    description: "Para quem sente dor nas costas que piora depois de um dia inteiro sentado.",
    goal: "terminar o dia de trabalho sem as costas pesando.",
    image: {
      src: "/images/coluna-lombar",
      alt: "Mãos de uma fisioterapeuta massageando a região lombar de um paciente",
    },
  },
  {
    id: "recuperacao-muscular",
    icon: "barbell",
    name: "Recuperação muscular",
    description: "Para quem treina e está com o músculo dolorido ou sobrecarregado.",
    goal: "treinar de novo sem aquela dor que não passa.",
    image: {
      src: "/images/recuperacao-muscular",
      alt: "Mão de um fisioterapeuta trabalhando a musculatura atrás do joelho de um paciente",
    },
  },
  {
    id: "mobilidade",
    icon: "stretching",
    name: "Mobilidade",
    description: "Para quem sente o corpo travado para agachar, correr ou se alongar.",
    goal: "agachar e correr sem sentir o corpo travado.",
    image: {
      src: "/images/mobilidade",
      alt: "Fisioterapeuta dobrando o quadril e o joelho de um paciente deitado na maca",
    },
  },
];

export const painMapSection = {
  title: "Onde dói?",
  text: "Toque na região e veja o tratamento indicado.",
  defaultRegion: "costas" as RegionId,
  treatmentLabel: "Tratamento indicado:",
  cta: "Agendar para este caso",
  legend: { pain: "dor", relief: "alívio" },
};

export const painRegions: {
  id: RegionId;
  label: string;
  title: string;
  description: string;
  treatment: TreatmentId;
}[] = [
  {
    id: "mandibula",
    label: "Mandíbula",
    title: "DTM",
    description:
      "Dor ao mastigar ou ao abrir a boca, estalos e tensão no rosto. Tratamos a articulação e orientamos os hábitos que sobrecarregam a mandíbula.",
    treatment: "cervical-dtm",
  },
  {
    id: "pescoco",
    label: "Pescoço",
    title: "Pescoço e dor de cabeça tensional",
    description:
      "Pescoço travado e dor de cabeça que começa na nuca. Alívio da tensão e ajustes de postura para o trabalho e o celular.",
    treatment: "cervical-dtm",
  },
  {
    id: "ombro",
    label: "Ombro",
    title: "Dor no ombro",
    description:
      "Dor ou rigidez para levantar o braço. Mobilidade e força para voltar a usar o ombro sem medo.",
    treatment: "mobilidade",
  },
  {
    id: "costas",
    label: "Costas",
    title: "Dor lombar",
    description:
      "Dor nas costas que piora depois de um dia sentado. Alívio da dor e orientações de postura para o seu dia a dia.",
    treatment: "coluna-lombar",
  },
  {
    id: "joelho",
    label: "Joelho",
    title: "Dor no joelho",
    description:
      "Dor para agachar, subir escada ou correr. Avaliação do movimento e exercícios para voltar a treinar no seu ritmo.",
    treatment: "mobilidade",
  },
  {
    id: "tornozelo",
    label: "Tornozelo",
    title: "Tornozelo travado",
    description:
      "Tornozelo dolorido ou travado depois de uma torção ou do treino. Mobilidade e estabilidade para apoiar o pé com confiança.",
    treatment: "mobilidade",
  },
];

export const howItWorks = {
  title: "Como funciona",
  text: "Quatro passos, sem você sair de casa.",
  steps: [
    {
      title: "Contato pelo WhatsApp",
      text: "Você conta o que está sentindo e combina o horário com a BLL.",
    },
    {
      title: "Avaliação da queixa",
      text: "Na primeira visita, o fisioterapeuta entende de onde vem a dor e o quanto ela atrapalha sua rotina.",
    },
    {
      title: "Sessão em casa",
      text: "O atendimento acontece na sua casa. Você não precisa se deslocar.",
    },
    {
      title: "Orientações e prevenção",
      text: "Você recebe orientações para o dia a dia e para o treino, para manter o resultado.",
    },
  ],
};

export const posture = {
  title: "Postura que pesa no pescoço",
  text: "Quando a cabeça vai para a frente, o pescoço passa o dia sobrecarregado. Essa postura pode contribuir para a dor de cabeça tensional.",
  before: "Antes",
  after: "Depois",
  caption: "Ângulo da cabeça, valores ilustrativos",
  figureLabel:
    "Comparação entre a postura com a cabeça projetada e a postura com o eixo alinhado",
};

export const contact = {
  title: "Agende sua avaliação e receba a BLL em casa.",
  text: "Preencha e a conversa abre no WhatsApp com a mensagem pronta.",
  fields: {
    name: { label: "Nome", placeholder: "Maria Souza" },
    phone: { label: "WhatsApp com DDD", placeholder: "(11) 91234-5678" },
    treatment: { label: "Tratamento", placeholder: "Qual tratamento?" },
  },
  submit: "Agendar avaliação",
  direct: "Chamar direto no WhatsApp",
  errors: {
    name: "Escreva seu nome.",
    phone: "Informe o WhatsApp com DDD.",
    treatment: "Escolha o tratamento.",
  },
  sent: 'Abrimos o WhatsApp com a sua mensagem. Se a conversa não abriu, toque em "Chamar direto no WhatsApp".',
  // Aparecem só enquanto o número do WhatsApp não estiver em src/config/site.ts.
  notConfigured:
    "Configure o número do WhatsApp em src/config/site.ts para este botão abrir a conversa.",
  draft: (message: string) =>
    `Mensagem pronta: "${message}" Configure o número do WhatsApp em src/config/site.ts para enviar.`,
};

export const whatsappMessages = {
  generic: "Olá! Quero agendar uma avaliação de fisioterapia em casa com a BLL.",
  form: ({ name, treatment, phone }: { name: string; treatment: string; phone: string }) =>
    `Olá! Meu nome é ${name}. Quero agendar uma avaliação em casa (${treatment}). Meu WhatsApp: ${phone}.`,
};

export const footer = {
  service: { title: "Atendimento", lines: ["Em domicílio", site.neighborhoods] },
  // As linhas do contato vêm do WhatsApp e do Instagram de src/config/site.ts.
  contact: { title: "Contato" },
  responsible: {
    title: "Responsável técnico",
    lines: [site.responsible.name, `CREFITO ${site.responsible.crefito}`],
  },
};

export const fab = {
  cta: "Agendar pelo WhatsApp",
};
