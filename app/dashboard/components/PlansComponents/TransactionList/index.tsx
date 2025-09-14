import React from "react";
import { transactionsAttributes } from "../../interfaces";
import { RiBarcodeFill } from "react-icons/ri";
import { IoCard } from "react-icons/io5";
import { MdLibraryBooks, MdOutlineRemoveRedEye } from "react-icons/md";
import { Bag } from "@/components/bag";
import { correctDate } from "@/lib/generalServices";
import { maskFunctions } from "@/lib/maskServices";

interface ITransactionList {
    transactions: transactionsAttributes[]
    transaction_selected: string | null
    setTransactionSelected: React.Dispatch<React.SetStateAction<string | null>>
}

const colors: any = {
    "outline": {
        "dark": '#7041ff',
        "light": '#7041ff'
    },
    "solid": {
        "dark": "#FFF",
        "light": "#FFF"
    }
}

/* ------------------------------------ */

const tertiary = "#07C5A6";
const four = "#394F8F";

const fail = "#FF6B6B";
const success = "#52C41A";
const info = "#FAAD14";

const gray = "#DBDBDB";
const white = "#FFF";
const backScan = "#BDE5F3";

const inactiveItens = {
    light: "#3a3a3a",
    dark: "#8A8A8A",
};

export const background = {
    light: "#f8f8f8",
    dark: "#1B191B",
};

export const secondary = {
    light: "#7041ff",
    dark: "#7041ff",
};

/* ------------------------------------ */

const status_of_transaction: any = {
    "new": {
        color: info,
        text: "Aguardando pagamento"
    },
    "waiting": {
        color: info,
        text: "Aguardando pagamento"
    },
    "identified": {
        color: info,
        text: "Aguardando pagamento"
    },
    "approved": {
        color: info,
        text: "Aguardando pagamento"
    },
    "paid": {
        color: success,
        text: "Pago"
    },
    "paid-free": {
        color: success,
        text: "Pago"
    },
    "unpaid": {
        color: fail,
        text: "Não pago"
    },
    "refunded": {
        color: fail,
        text: "Devolvido"
    },
    "contested": {
        color: fail,
        text: "Contestado"
    },
    "canceled": {
        color: fail,
        text: "Cancelado"
    },
    "settled": {
        color: success,
        text: "Pago"
    },
    "link": {
        color: info,
        text: "Aguardando pagamento"
    },
    "expired": {
        color: fail,
        text: "Expirado"
    }
}

const getStatus = ({ color, text, icon }: {
    color: string
    text: string
    icon: React.ReactNode | null
}): React.ReactElement => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "uppercase",
            }}
        >
            <div
                style={{
                    whiteSpace: "nowrap",
                    color: color,
                    border: `1px solid ${color}`,
                    padding: "5px 10px",
                    fontSize: 12,
                    borderRadius: 4,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyItems: 'center'
                }}
            >
                {icon ? icon : null} {text}
            </div>
        </div>
    );
};


const transaction_pay_method = (transaction: transactionsAttributes) => {
    if (transaction.method === "credit_card") {
        return (
            <div className="flex items-center gap-5">
                <IoCard size={20} color={inactiveItens['light']} />
                <b style={{ textTransform: "capitalize" }}>{transaction?.card_flag} </b>
                ****{transaction?.card_mask?.replace(/\D/g, "")}
            </div>
        )
    }
    else if (transaction.method === "banking_billet") return (
        <div className="flex items-center gap-5">
            <RiBarcodeFill size={20} color={inactiveItens['light']} />
            <b style={{ textTransform: "capitalize" }}>Boleto Bancário</b>
        </div>
    )
    else return (
        <div className="flex items-center gap-5">
            {/*    <TbHeartHandshake size={20} color={inactiveItens['light']} /> */}
            <b style={{ textTransform: "capitalize" }}>Grátis</b>
        </div>
    )
}

export const TransactionList: React.FC<ITransactionList> = (props) => {
    const { transactions, setTransactionSelected, transaction_selected } = props

    const transactionsSorted = transactions.sort((a, b) => new Date(b?.createdAt || '').getTime() - new Date(a?.createdAt || '').getTime());

    return (
        <Bag title="HISTORÍCO DE COMBRANÇAS" description="RELATÓRIO DE COBRANÇAS REALIZADAS EM SEU MEIO DE PAGAMENTO." icon={<MdLibraryBooks color={secondary['light']} size={26} />}>
            <div className="m-5 font-[13px] rounded-md overflow-auto border-2 border-border">
                <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ background: background['light'] }}>
                            <th style={{ padding: 10, whiteSpace: "nowrap" }}>CÓDIGO</th>
                            <th style={{ whiteSpace: "nowrap", padding: 10, textAlign: "center" }}>GERADA EM</th>
                            <th style={{ whiteSpace: "nowrap", padding: 10, textAlign: "center" }}>PAGO EM</th>
                            <th style={{ padding: 10, whiteSpace: "nowrap", textAlign: "center" }}>PLANO</th>
                            <th style={{ textAlign: "center", padding: 10 }}>VALOR</th>
                            <th style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10 }}>MÉTODO DE PAGAMENTO</th>
                            <th style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10 }}>ACOMODAÇÕES</th>
                            <th style={{ textAlign: "center", padding: 10 }}>STATUS</th>
                            <th style={{ padding: 10, textAlign: "center" }} > AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsSorted?.map((transaction) => (
                            <tr onClick={() => setTransactionSelected(transaction.id)} style={{ background: colors['light'] }} key={transaction.id}>
                                <td style={{ whiteSpace: "nowrap", padding: 10, textTransform: "uppercase" }}>
                                    {transaction?.friendly_id ? `#${transaction?.friendly_id}` : "-"}
                                </td>
                                <td style={{ padding: 10, whiteSpace: "nowrap", textAlign: "center" }}>
                                    {correctDate(transaction.createdAt)}
                                </td>
                                <td style={{ padding: 10, whiteSpace: "nowrap", textAlign: "center" }}>
                                    {["paid", "settled", "paid-free"].includes(transaction.status) ? correctDate(transaction?.data_payment) : "-"}
                                </td>
                                <td style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10, textTransform: "uppercase" }}>
                                    {transaction.subscriptions?.plans?.name}
                                </td>
                                <td style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10, textTransform: "uppercase" }}>
                                    {maskFunctions.currency.mask(transaction.value)}
                                </td>
                                <td style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10, textTransform: "uppercase" }}>
                                    <div className="flex" style={{ alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        {transaction_pay_method(transaction)}
                                    </div>
                                </td>
                                <td style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10, textTransform: "uppercase" }}>
                                    {transaction?.quantity_accommodations}
                                </td>
                                <td style={{ textAlign: "center", whiteSpace: "nowrap", padding: 10, textTransform: "uppercase" }}>
                                    <div className="flex" style={{ justifyContent: "center" }}>
                                        {getStatus({
                                            color: status_of_transaction[transaction.status].color,
                                            text: status_of_transaction[transaction.status].text,
                                            icon: null
                                        })}
                                    </div>
                                </td>
                                {/*  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                    <Tooltip onClick={() => setTransactionSelected(transaction.id)} title={"Visualizar"} style={{ margin: 5 }}>
                                        <IconButton aria-label={"Visualizar"}>
                                            <MdOutlineRemoveRedEye color={secondary[theme]} size={20} />
                                        </IconButton>
                                    </Tooltip>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/*  {transaction_selected &&
                <ModalReceipt
                    transaction_id={transaction_selected}
                    onCancel={() => setTransactionSelected(null)}
                    openModal={true}
                    title="Pagamento da assinatura"
                />
            } */}
        </Bag>
    )
}