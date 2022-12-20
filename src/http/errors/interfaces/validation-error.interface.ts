export interface ValidationErrorInterface {
    properties: string;
    errors: Record<string, string>;
    nested: ValidationErrorInterface[];
}
