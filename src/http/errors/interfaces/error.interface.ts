export interface ErrorInterface {
    properties: string[];
    errors: Record<string, string>;
    nested: ErrorInterface[];
}
