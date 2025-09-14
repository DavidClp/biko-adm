interface ICorrectDateProps {
    month_in_extension?: boolean
    no_have_time?: boolean
}

export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const valueIsEmpty = (value: any) => {
    return [undefined, null, ""].includes(value)
}

export const removeError = (id: string) => {
    const input: any = document.getElementById(id)
    if (input) input.setCustomValidity("")
}

export const addError = (id: string, error: string) => {
    const input: any = document.getElementById(id)
    if (input) input?.setCustomValidity(error)
}

export const correct_date_filter = (date: any) => {
    const day = `${Number.parseInt(date.day) > 9 ? Number.parseInt(date.day) : `0${Number.parseInt(date.day)}`}`
    const month = `${Number.parseInt(date.month) > 9 ? Number.parseInt(date.month) : `0${Number.parseInt(date.month)}`}`
    const year = date.year
    return `${day}/${month}/${year}`
}

export const correctDate = (date: any, props: ICorrectDateProps = {}) => {
    const { month_in_extension, no_have_time } = props
    if (!date) return ''
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const months_in_extension = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const correct_months = month_in_extension ? months_in_extension : months

    date = new Date(date)
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`
    const year = date.getFullYear()
    const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`

    return `${day} ${month_in_extension ? 'de ' : ''}${correct_months[month - 1]} ${month_in_extension ? 'de ' : ''}${year}${no_have_time ? '' : ` às ${hours}:${minutes}`}`
}

export const correctDate3 = (date: any, props: ICorrectDateProps = {}) => {
    const { month_in_extension } = props
    if (!date) return ''
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const months_in_extension = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const correct_months = month_in_extension ? months_in_extension : months

    date = new Date(date)
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`
    const year = date.getFullYear()

    return `${day} ${month_in_extension ? 'de ' : ''}${correct_months[month - 1]}`
}

export const correctDateDashboard = (date: any) => {
    if (!date) return ''
    date = new Date(date)
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`
    const year = date.getFullYear()
    const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`
    return `${day}/${month}/${year} às ${hours}:${minutes}`
}

export const correctDateRange = (date: any) => {
    if (!date) return ''
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    date = new Date(date)
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`
    const year = date.getFullYear()
    return `${day} ${months[month - 1]} ${year}`
}

export const correctDate2 = (date: any) => {
    if (!date) return ""
    date = new Date(date)
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export const generateDate = (date: any) => {
    const array = date?.split("/")
    if (!array || array.length < 3 || valueIsEmpty(array?.[2])) return null
    const day = array[0]
    const month = array[1]
    const year = array[2]
    return new Date(`${month}/${day}/${year}`)
}

export const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("'", "''")
}

export const getValue = (obj: any, { keys, mask, transform, get_type_mask, magic_key, is_person, is_component }: any) => {
    let value = obj

    keys.forEach((key: any) => {
        value = value?.[key]
    })
    if (is_component) return mask(value)

    if (is_person && value) {
        return [
            {
                id: value?.id,
                name: magic_key ? value?.[magic_key]?.registration_data?.name : value?.registration_data?.name
            }
        ]
    }
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
    if (get_type_mask) mask = get_type_mask(obj)
    if (mask && value) value = mask(value)
    if (transform) value = transform[value]
    if (!['string', 'number'].includes(typeof value)) {
        if (value?.length === 0) return '-'
        return value?.map((v: any) => ({
            id: v?.id,
            name: magic_key ? v?.[magic_key]?.registration_data?.name : v?.registration_data?.name
        }))
    }
    return value
}

export const calcAge = (birthDate: any) => {
    if (!birthDate) return "0"
    birthDate = new Date(`${birthDate}`)
    const now = (new Date()).getTime()
    birthDate = birthDate.getTime()
    return ((now - birthDate) / 31536000000).toFixed(2)
}

export const updateData = (oldData: any, newData: any) => {
    Object.keys(newData).map(function (key, value) {
        oldData[key] = newData[key]
    });
    return oldData
}

export const copyOf = (data: any) => {
    if (!data) return data
    return JSON.parse(JSON.stringify(data))
}

export const isCpfValid = (cpf: string) => {
    if (!cpf) return false

    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;

    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999") return false;

    let add = 0;

    for (let i = 0; i < 9; i++)add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;

    add = 0;
    for (let i = 0; i < 10; i++)add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);

    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;

    return true;
}

export const isCnpjValid = (cnpj: string) => {
    if (!cnpj) return false
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;

    if (cnpj.length != 14 ||
        cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999") return false;

    let tamanho = cnpj.length - 2
    let numeros: any = cnpj.substring(0, tamanho);
    let digitos: any = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;

    return true
}

export async function delay(interval: number) {
    await new Promise(resolve => setTimeout(resolve, interval))
}

export const correctName = (registration_data: any) => {
    return registration_data.type === 'PF' ? registration_data.name : registration_data.fantasy_name
}

export const setUpConsultation = (consultation: any) => {
    const keys = Object.keys(consultation)
    let newConsultation = ''

    keys.map(key => {
        if (!valueIsEmpty(consultation[key])) {
            if (typeof consultation[key] === "object") consultation[key] = JSON.stringify(consultation[key])
            newConsultation += `${key}=${consultation[key]}&`
        }
    })

    return newConsultation
}

export const initialsName = (name: string) => {
    let name_array = name.toUpperCase().split(' ')
    name_array = name_array.filter(item => item !== '')
    return name_array.length > 1 ? `${name_array[0].split('')[0]}${name_array[1].split('')[0]}` : `${name_array[0].split('')[0]}`
}