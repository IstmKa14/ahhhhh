export type ChatMessageSender = 'bloom' | 'user';

export type ChatMessage = {
  readonly text: string;
  readonly sender: ChatMessageSender;
};

export type HowItWorksStep = {
  readonly num: string;
  readonly title: string;
  readonly body: string;
};

export type MoodCard = {
  readonly label: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};

export type ResetTool = {
  readonly label: string;
};

export type SectionNumberProps = {
  number: string;
  label: string;
  dark?: boolean;
};
