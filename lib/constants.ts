export const TEMPLATES = [
  { id: "nestjs-clean", label: "NestJS (clean)", language: "node" as const },
  { id: "go-clean", label: "Go (clean)", language: "go" as const },
  { id: "python-clean", label: "Python (clean)", language: "python" as const },
];

export const LANGUAGES = [
  { value: "node", label: "Node" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
] as const;

export const DATABASES = [
  { value: "none", label: "None" },
  { value: "postgres", label: "PostgreSQL" },
  { value: "mongo", label: "MongoDB" },
] as const;

export const MESSAGING_OPTIONS = [
  { value: "none", label: "None" },
  { value: "kafka", label: "Kafka" },
  { value: "rabbitmq", label: "RabbitMQ" },
] as const;

export const CI_PROVIDERS = [
  { value: "github", label: "GitHub Actions" },
  { value: "gitlab", label: "GitLab CI" },
  { value: "none", label: "None" },
] as const;

export const INFRA_OPTIONS = [
  { value: "none", label: "None" },
  { value: "pulumi", label: "Pulumi (AWS starter in infra/)" },
] as const;

/** Matches CLI: only `clean` today. */
export const ARCHITECTURE_OPTIONS = [{ value: "clean", label: "Clean (DDD-style modules)" }] as const;

export const MANAGEABLE_FEATURES = [
  { id: "logging", label: "Logging", cli: true },
  { id: "kafka", label: "Kafka", cli: true },
  { id: "rabbitmq", label: "RabbitMQ", cli: true },
  { id: "auth", label: "Auth (JWT)", cli: false },
  { id: "cache", label: "Cache (Redis)", cli: false },
] as const;

export type ManageableFeatureId = (typeof MANAGEABLE_FEATURES)[number]["id"];
