/** Mirrors CLI templates (see cli/src/lib/scaffold.js). */
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

/** Dashboard feature toggles: CLI-backed + extras aligned with create --auth / common cache wiring. */
export const MANAGEABLE_FEATURES = [
  { id: "logging", label: "Logging", cli: true },
  { id: "kafka", label: "Kafka", cli: true },
  { id: "rabbitmq", label: "RabbitMQ", cli: true },
  { id: "auth", label: "Auth (JWT)", cli: false },
  { id: "cache", label: "Cache (Redis)", cli: false },
] as const;

export type ManageableFeatureId = (typeof MANAGEABLE_FEATURES)[number]["id"];
