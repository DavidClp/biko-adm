import { MaskTypes } from "@/app/dashboard/components/interfaces";
import { generateDate, valueIsEmpty } from "./generalServices";

const MaskMoneyInt = (money: any) => {
    if (valueIsEmpty(money)) return "R$ 0"
    if (typeof money === "number") money = money.toFixed(2)
    else money = Number.parseFloat(money).toFixed(2)

    let stringReais = money.split(".")[0]

    let newStringReaisRevert = ""

    let cont = 0

    for (let i = (stringReais.length - 1); i >= 0; i--) {
        let num = stringReais[i]
        if ((cont % 3) === 0 && cont !== 0) newStringReaisRevert += "." + num
        else newStringReaisRevert += num
        cont++
    }

    let newStringReais = ""

    for (let i = (newStringReaisRevert.length - 1); i >= 0; i--)newStringReais += newStringReaisRevert[i]

    const newStringMoney = "R$ " + newStringReais

    return newStringMoney
}

const MaskCPF_CNPJ = (cpf_cnpj: any) => {
    if (valueIsEmpty(cpf_cnpj)) return ""

    if (cpf_cnpj.length <= 11) return maskFunctions.cpf.mask(cpf_cnpj);
    else return maskFunctions.cnpj.mask(cpf_cnpj)
}

const MaskMxCoin = (number: any) => {
    if (valueIsEmpty(number)) return ""
    number = Number.parseInt(`${Number.parseFloat(`${number}`)}`)
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const MaskCPF = (cpf: any) => {
    if (valueIsEmpty(cpf)) return ""

    // Remove todos os caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, "")
    
    // Limita a 11 dígitos
    const limitedCpf = cleanCpf.substring(0, 11)
    
    let string = ""
    for (let i = 0; i < limitedCpf.length; i++) {
        let char = limitedCpf[i]
        if (i === 3 || i === 6) string += "." + char
        else if (i === 9) string += "-" + char
        else string += char
    }
    return string
}

const MaskCNPJ = (cnpj: any) => {
    if (valueIsEmpty(cnpj)) return ""
    
    // Remove todos os caracteres não numéricos
    const cleanCnpj = cnpj.replace(/\D/g, "")
    
    // Limita a 14 dígitos
    const limitedCnpj = cleanCnpj.substring(0, 14)
    
    let string = ""
    for (let i = 0; i < limitedCnpj.length; i++) {
        let char = limitedCnpj[i]
        if (i === 2 || i === 5) string += "." + char
        else if (i === 8) string += "/" + char
        else if (i === 12) string += "-" + char
        else string += char
    }
    return string
}

export const MaskPhone = (phone: any) => {
    if (valueIsEmpty(phone)) return ""
    
    let cleanPhone = phone.replace(/\D/g, "")

    if (cleanPhone?.length > 11 && cleanPhone?.startsWith('55')) {
        // Considera 55 como DDI do Brasil e remove
        cleanPhone = cleanPhone.slice(2);
      }
    
    
    // Limita a 11 dígitos
    const limitedPhone = cleanPhone.substring(0, 11)
    
    let string = ""
    if (limitedPhone.length < 11) {
        for (let i = 0; i < limitedPhone.length; i++) {
            let char = limitedPhone[i]
            if (i === 0) string += "(" + char
            else if (i === 2) string += ") " + char
            else if (i === 6) string += "-" + char
            else string += char
        }
    }
    else {
        for (let i = 0; i < limitedPhone.length; i++) {
            let char = limitedPhone[i]
            if (i === 0) string += "(" + char
            else if (i === 1) string += char + ")"
            else if (i === 2 || i === 3) string += " " + char
            else if (i === 7) string += "-" + char
            else string += char
        }
    }

    return string;
}
const MaskMoney = (money: string | number | null | undefined): string => {
    if (money === null || money === undefined || money === "") return "R$ 0,00"

    const sanitizedMoney = money.toString().replace(",", ".")

    const numericMoney = parseFloat(sanitizedMoney)
    if (isNaN(numericMoney)) return "R$ 0,00"

    const fixedMoney = numericMoney.toFixed(2)
    const [stringReais, stringCentavos] = fixedMoney.split(".")

    let newStringReais = ""
    let cont = 0

    for (let i = stringReais.length - 1; i >= 0; i--) {
        newStringReais = stringReais[i] + newStringReais
        cont++
        if (cont % 3 === 0 && i !== 0) {
            newStringReais = "." + newStringReais
        }
    }

    return `R$ ${newStringReais},${stringCentavos}`
}
const MaskDate = (date: any) => {
    if (valueIsEmpty(date)) return ""
    date = date?.replace(/\D+/g, "")
    let newDate = "";
    for (let i = 0; i < date.length; i++) {
        if (i === 2 || i === 4) newDate += "/" + date[i]
        else newDate += date[i]
    }
    return newDate;
}

const MaskCEP = (cep: string) => {
    if (valueIsEmpty(cep)) return ""
    
    // Remove todos os caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, "")
    
    // Limita a 8 dígitos
    const limitedCep = cleanCep.substring(0, 8)
    
    let string = ""
    for (let i = 0; i < limitedCep.length; i++) {
        let char = limitedCep[i]
        if (i === 5) string += "-" + char
        else string += char
    }
    return string
}

const MaskPorcen = (porcen: any, withPorcen?: boolean) => {
    if (valueIsEmpty(porcen)) return "0,00 %"
    if (typeof porcen === "number") porcen = porcen.toFixed(2)
    else porcen = Number.parseFloat(porcen).toFixed(2)

    let stringCentavos = porcen.split(".")[1]
    let stringReais = porcen.split(".")[0]
    let newStringReaisRevert = ""

    let cont = 0

    for (let i = (stringReais.length - 1); i >= 0; i--) {
        let num = stringReais[i]
        if ((cont % 3) === 0 && cont !== 0) newStringReaisRevert += "." + num
        else newStringReaisRevert += num
        cont++
    }

    let newStringReais = ""

    for (let i = (newStringReaisRevert.length - 1); i >= 0; i--)newStringReais += newStringReaisRevert[i]

    const newStringMoney = newStringReais + "," + stringCentavos + (withPorcen ? " %" : "")

    return newStringMoney
}

const MaskM2 = (money: any, withM2?: boolean) => {
    if (valueIsEmpty(money)) return ""
    if (typeof money === "number") money = money.toFixed(2)
    let stringCentavos = money.split(".")[1]
    let stringReais = money.split(".")[0]

    let newStringReaisRevert = ""

    let cont = 0

    for (let i = (stringReais.length - 1); i >= 0; i--) {
        let num = stringReais[i]
        if ((cont % 3) === 0 && cont !== 0) newStringReaisRevert += "." + num
        else newStringReaisRevert += num
        cont++
    }

    let newStringReais = ""

    for (let i = (newStringReaisRevert.length - 1); i >= 0; i--)newStringReais += newStringReaisRevert[i]

    const newStringMoney = newStringReais + "," + stringCentavos + (withM2 ? " m²" : "")

    return newStringMoney
}

const MaskCreditCard = (value: string) => {
    const newValue = value.replace(/\D/g, '')
    let firstPart = newValue.slice(0, 4)
    let secondPart = value.length < 16 ? newValue.slice(4, 10) : newValue.slice(4, 8)
    let thirdPart = value.length < 16 ? newValue.slice(10, 16) : newValue.slice(8, 12)
    let fourthPart = value.length < 16 ? '' : newValue.slice(12, 16)

    if (value.length < 16) {
        firstPart = firstPart ? firstPart : ''
        secondPart = secondPart ? secondPart : ''
        thirdPart = thirdPart ? thirdPart : ''

        secondPart = (firstPart.replace(/\D/g, '').length === 4 && secondPart.replace(/\D/g, '').length > 0) ? ' ' + secondPart : secondPart
        thirdPart = (secondPart.replace(/\D/g, '').length === 6 && thirdPart.replace(/\D/g, '').length > 0) ? ' ' + thirdPart : thirdPart
    }
    else {
        firstPart = firstPart ? firstPart : ''
        secondPart = secondPart ? secondPart : ''
        thirdPart = thirdPart ? thirdPart : ''
        fourthPart = fourthPart ? fourthPart : ''

        secondPart = (firstPart.replace(/\D/g, '').length === 4 && secondPart.replace(/\D/g, '').length > 0) ? ' ' + secondPart : secondPart
        thirdPart = (secondPart.replace(/\D/g, '').length === 4 && thirdPart.replace(/\D/g, '').length > 0) ? ' ' + thirdPart : thirdPart
        fourthPart = (thirdPart.replace(/\D/g, '').length === 4 && fourthPart.replace(/\D/g, '').length > 0) ? ' ' + fourthPart : fourthPart
    }

    return `${firstPart}${secondPart}${thirdPart}${fourthPart}`
}

const MaskInt = (int: any) => {
    int = typeof int === "object" ? int?.value : int
    int = !valueIsEmpty(int) ? `${int}` : ""
    int = int?.replace(/\D/g, "")
    if (valueIsEmpty(int)) return ""
    return `${Number.parseInt(int)}`
}

const MaskDueDate = (date: string) => {
    const limit = date.length >= 6 ? 6 : date.length
    let string = ""
    for (let i = 0; i < limit; i++) {
        let char = date[i]
        if (i === 2) string += '/' + char
        else string += char
    }
    return string
}

// UNMASK

const UnMaskMoney = (money: any) => {
    if (valueIsEmpty(money)) return 0
    money = money.replace(/\D+/g, "")
    money = Number.parseInt(money) / 100
    return money
}

const UnMaskMoneyInt = (money: any) => {
    if (valueIsEmpty(money)) return 0
    money = money.replace(/\D+/g, "")
    money = Number.parseInt(money)
    return money
}

const UnMaskM2 = (m2: any) => {
    if (valueIsEmpty(m2)) return null
    m2 = m2.replace(/\D+/g, "")
    m2 = Number.parseInt(m2) / 100
    return m2
}

const UnMaskPorcent = (porcen: any) => {
    if (valueIsEmpty(porcen)) return 0
    porcen = porcen.replace(/\D+/g, "")
    porcen = Number.parseInt(porcen) / 100
    return porcen
}

const UnMaskCPF = (cpf: any) => {
    return UnMaskGeneric(cpf, 11)
}

const UnMaskCPF_CNPJ = (cpf_cnpj: any) => {
    return UnMaskGeneric(cpf_cnpj, 14)
}

const UnMaskCNPJ = (cpf: any) => {
    return UnMaskGeneric(cpf, 14)
}

const UnMaskPhone = (phone: any) => {
    return UnMaskGeneric(phone, 11)
}

const UnMaskDate = (date: any) => {
    if (valueIsEmpty(date)) return null
    return generateDate(date.substring(0, 10))
}

const UnMaskCEP = (cep: any) => {
    return UnMaskGeneric(cep, 8)
}

const UnMaskGeneric = (value: any, maxLength: number) => {
    if (valueIsEmpty(value)) return ""
    let unMaskValue = value.replace(/\D/g, "")
    unMaskValue = unMaskValue.substring(0, maxLength)
    return unMaskValue
}

type MaskFunctionsType = {
    [key in MaskTypes | "none" | "mxs"]: {
        mask: (value: any, extra?: boolean) => string,
        unMask: (value: any, extra?: boolean) => string | Date | number | null
    };
};

export const maskFunctions: MaskFunctionsType = {
    text: {
        mask: (value: string) => value,
        unMask: (value: string) => value
    },
    none: {
        mask: (value: string) => value,
        unMask: (value: string) => value
    },
    mxs: {
        mask: MaskMxCoin,
        unMask: (value: string) => value
    },
    currency: {
        mask: MaskMoney,
        unMask: UnMaskMoney
    },
    cpf: {
        mask: MaskCPF,
        unMask: UnMaskCPF
    },
    cnpj: {
        mask: MaskCNPJ,
        unMask: UnMaskCNPJ
    },
    cpfOrCnpj: {
        mask: MaskCPF_CNPJ,
        unMask: UnMaskCPF_CNPJ
    },
    cep: {
        mask: MaskCEP,
        unMask: UnMaskCEP
    },
    phone: {
        mask: MaskPhone,
        unMask: UnMaskPhone
    },
    date: {
        mask: MaskDate,
        unMask: UnMaskDate
    },
    porcen: {
        mask: MaskPorcen,
        unMask: UnMaskPorcent
    },
    m2: {
        mask: MaskM2,
        unMask: UnMaskM2
    },
    currencyInt: {
        mask: MaskMoneyInt,
        unMask: UnMaskMoneyInt
    },
    creditCard: {
        mask: MaskCreditCard,
        unMask: (value: string) => value.replace(/\D/g, "")
    },
    dueDate: {
        mask: MaskDueDate,
        unMask: (value: string) => value
    },
    int: {
        mask: MaskInt,
        unMask: (value: string) => !valueIsEmpty(value) ? Number.parseInt(value) : null
    },
    onlyNumber: {
        mask: (value: string) => value,
        unMask: (value: string) => value
    }, 
    file: {
        mask: (value: any) => value,
        unMask: (value: any) => value
    }
}