export interface ValidationErrorInterface {
  errors: Array<string>;
  name: string;
}

export interface ValidationPayloadInterface {
  constraints: Record<string, string>;
  property: string;
}
