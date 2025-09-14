const fail = "#FF6B6B";
const success = "#52C41A";
const info = "#FAAD14";

export const subscription_situations: any = {
    "active": {
        color: success,
        text: "Ativo"
    },
    "paid": {
        color: success,
        text: "Ativo"
    },
    "paid-free": {
        color: info,
        text: "Teste grátis"
    },
    "unpaid": {
        color: fail,
        text: "Suspenso"
    },
    "waiting-block": {
        color: info,
        text: "Aguardando pagamento"
    },
    "waiting-alert": {
        color: info,
        text: "Aguardando pagamento"
    },
    "waiting": {
        color: info,
        text: "Aguardando pagamento"
    },
    "expired": {
        color: fail,
        text: "Expirado"
    },
    "canceled": {
        color: fail,
        text: "Cancelado"
    },
    "not-have-transactions": {
        color: info,
        text: "Nenhuma transação"
    },
    "not-have-subscription": {
        color: info,
        text: "Nenhuma assinatura"
    }
}

export const subscription_description: any = {
    "paid": "A sua assinatura está ativa e você pode utilizar todos os benefícios.",
    "unpaid": (
        <>
            Sua assinatura está suspensa por falta de
            pagamento. <b> Renove sua assinatura</b> para
            continuar utilizando os benefícios.
        </>
    ),
    "paid-free": (
        <>
            A sua assinatura está ativa por um período de testes de 7 dias.
        </>
    ),
    "waiting-block": (
        <>
            A sua assinatura será ativada após o pagamento da cobrança do mês atual.
        </>
    ),
    "waiting-alert": (
        <>
            A sua assinatura será suspensa caso não efetue o pagamento da sua assinatura.
        </>
    ),
    "waiting": (
        <>
            Aguardando o pagamento da fatura referente ao mês atual.
        </>
    ),
    "expired": (
        <>
            Sua assinatura expirou. <b> Renove sua assinatura </b> para
            continuar utilizando os benefícios.
        </>
    ),
    "canceled": (
        <>
            Sua assinatura foi cancelada. <b> Renove sua assinatura </b> para
            continuar utilizando os benefícios.
        </>
    ),
    "not-have-transactions": (
        <>
            A sua assinatura será ativada após o pagamento da cobrança do mês atual.
        </>
    )
}

export const subscription_situations_header: any = {
    "paid-free": {
        color: info,
        text: "Você está em um período de testes grátis"
    },
    "waiting-alert": {
        color: info,
        text: "Seu acesso aos módulos será suspenso"
    },
    "waiting-block": {
        color: info,
        text: "Aguardando pagamento"
    }
}

export const subscription_description_header: any = {
    "paid-free": "A sua assinatura está ativa por um período de testes de 7 dias.",
    "waiting-alert": "Sua assinatura será suspensa caso não efetue o pagamento da mesma até o dia",
    "waiting-block": "A sua assinatura está suspensa por falta de pagamento."
}