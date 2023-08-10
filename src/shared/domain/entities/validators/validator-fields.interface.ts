export type FieldsErrors = {
    [field: string]: string[]
}

export interface ValidatorFields<PropsValidated> {
    errors: FieldsErrors
    validatedData: PropsValidated

    validate(data: any): boolean
}
