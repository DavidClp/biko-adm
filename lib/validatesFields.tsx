import valid from "card-validator";
import { generateDate, isCnpjValid, isCpfValid } from "./generalServices";
import * as Yup from "yup";
import { maskFunctions } from "./maskServices";

export const validateEmail = async (email: string) => {
    if (email && email.length > 0) {
        const schemaEmail = Yup.object().shape({
            email: Yup.string().email("Formato Inválido")
        })

        try {
            await schemaEmail.validate({ email })
        } catch (err: any) {
            return err.errors ? err.errors[0] : "Formato Inválido"
        }
    }

    return true
}

export const validateCPF = async (cpf: string) => {
    if (cpf && cpf.length > 0 && !isCpfValid(cpf)) return "Formato Inválido"
    return true
}

export const validateCNPJ = async (cnpj: string) => {
    if (cnpj && cnpj.length > 0 && !isCnpjValid(cnpj)) return "Formato Inválido"
    return true
}

export const validateCPFOrCNPJ = async (cpfOrCnpj: string) => {
    if (cpfOrCnpj && cpfOrCnpj.length > 0) {
        if (cpfOrCnpj.length <= 14) return await validateCPF(cpfOrCnpj)
        return await validateCNPJ(cpfOrCnpj)
    }
    return true
}

export const validatePhone = async (phone: string) => {
    phone = phone?.replace(/\D/g, "")
  /*   if (phone && phone.length > 0) {
        const schemaPhone = Yup.object().shape({
            phone: Yup.string().min(10, "Formato Inválido").max(11, "Formato Inválido")
        })
        try {
            await schemaPhone.validate({ phone })
        } catch (err: any) {
            return err.errors ? err.errors[0] : "Formato Inválido"
        }
    } */
    return true
}

export const validateCEP = async (cep: string) => {
    cep = cep?.replace(/\D/g, "")
    if (cep && cep.length > 0) {
        const schemaCEP = Yup.object().shape({
            cep: Yup.string().min(8, "Formato Inválido").max(8, "Formato Inválido")
        })
        try {
            await schemaCEP.validate({ cep })
        } catch (err: any) {
            return err.errors ? err.errors[0] : "Formato Inválido"
        }
    }
    return true
}

export const validateDueDate = async (dueDate: string) => {
    const value = dueDate.replace(/\D+/g, "")
    const first_part = value.slice(0, 2)
    const second_part = value.slice(2, value.length)

    if (first_part.length === 2 && second_part.length === 4) {
        const dueDateComplete = "01/" + dueDate
        const correctDate: any = generateDate(dueDateComplete)
        const atualDate = new Date()

        if (!correctDate?.getDate()) return "Informe uma data no formato MM/AAAA"
        else if (correctDate?.getTime() && (correctDate?.getTime() < atualDate.getTime())) return "Cartão vencido"
    }
    else return "Informe uma data no formato MM/AAAA"

    return true
}

export const validateCardNumber = async (cardNumber: string) => {
    const card = valid.number(cardNumber.replace(/\D+/g, ""))
    if (!card?.isValid) return "Número do cartão inválido"
    return true
}

export const validateDate = async (date: string) => {
    if (date && date.length > 0) {
        date = date?.replace(/\D/g, "")
        date = maskFunctions.date.mask(date)
        const correctDate: any = generateDate(date)
        if (!correctDate?.getDate()) return "Formato Inválido"
    }
    return true
}