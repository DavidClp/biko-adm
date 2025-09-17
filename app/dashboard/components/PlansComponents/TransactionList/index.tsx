import React from "react";
import { transactionsAttributes } from "../../interfaces";
import { RiBarcodeFill } from "react-icons/ri";
import { IoCard } from "react-icons/io5";
import { MdLibraryBooks, MdOutlineRemoveRedEye, MdCalendarToday, MdPayment, MdBusiness } from "react-icons/md";
import { Bag } from "@/components/bag";
import { correctDate } from "@/lib/generalServices";
import { maskFunctions } from "@/lib/maskServices";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Badge 
            variant="outline" 
            className="text-xs font-semibold uppercase"
            style={{ 
                color: color, 
                borderColor: color,
                backgroundColor: `${color}10`
            }}
        >
            {icon && <span className="mr-1">{icon}</span>}
            {text}
        </Badge>
    );
};


const transaction_pay_method = (transaction: transactionsAttributes) => {
    if (transaction.method === "credit_card") {
        return (
            <div className="flex items-center gap-2">
                <IoCard size={16} className="text-gray-600" />
                <span className="text-sm font-medium capitalize">{transaction?.card_flag}</span>
                <span className="text-xs text-gray-500">****{transaction?.card_mask?.replace(/\D/g, "")}</span>
            </div>
        )
    }
    else if (transaction.method === "banking_billet") return (
        <div className="flex items-center gap-2">
            <RiBarcodeFill size={16} className="text-gray-600" />
            <span className="text-sm font-medium capitalize">Boleto Bancário</span>
        </div>
    )
    else return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize text-green-600">Grátis</span>
        </div>
    )
}

// Componente de card individual para transação
const TransactionCard: React.FC<{
    transaction: transactionsAttributes;
    onClick: () => void;
}> = ({ transaction, onClick }) => {
    const isPaid = ["paid", "settled", "paid-free"].includes(transaction.status);
    
    return (
        <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4"
            style={{ borderLeftColor: status_of_transaction[transaction.status].color }}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex flex-col space-y-3">
                    {/* Header com código e status */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                                {transaction?.friendly_id ? `#${transaction?.friendly_id}` : "Sem código"}
                            </span>
                            <span className="text-xs text-gray-500 uppercase">
                                {transaction.subscriptions?.plans?.name}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-gray-900">
                                {maskFunctions.currency.mask(transaction.value)}
                            </span>
                            {getStatus({
                                color: status_of_transaction[transaction.status].color,
                                text: status_of_transaction[transaction.status].text,
                                icon: null
                            })}
                        </div>
                    </div>

                    {/* Informações principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <MdCalendarToday size={16} className="text-gray-500" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Gerada em</span>
                                <span className="text-sm font-medium">{correctDate(transaction.createdAt)}</span>
                            </div>
                        </div>
                        
                        {isPaid && (
                            <div className="flex items-center gap-2">
                                <MdPayment size={16} className="text-green-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Pago em</span>
                                    <span className="text-sm font-medium">{correctDate(transaction?.data_payment)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            {transaction_pay_method(transaction)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const TransactionList: React.FC<ITransactionList> = (props) => {
    const { transactions, setTransactionSelected, transaction_selected } = props

    const transactionsSorted = transactions.sort((a, b) => new Date(b?.createdAt || '').getTime() - new Date(a?.createdAt || '').getTime());

    return (
        <Bag title="HISTÓRICO DE COBRANÇAS" description="Relatório de cobranças realizadas em seu meio de pagamento." icon={<MdLibraryBooks color={secondary['light']} size={26} />}>
            <div className="p-4 space-y-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gerada em</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pago em</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactionsSorted?.map((transaction) => (
                                    <tr 
                                        key={transaction.id}
                                        onClick={() => setTransactionSelected(transaction.id)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {transaction?.friendly_id ? `#${transaction?.friendly_id}` : "-"}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {correctDate(transaction.createdAt)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {["paid", "settled", "paid-free"].includes(transaction.status) ? correctDate(transaction?.data_payment) : "-"}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center uppercase">
                                            {transaction.subscriptions?.plans?.name}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                                            {maskFunctions.currency.mask(transaction.value)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {transaction_pay_method(transaction)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            {getStatus({
                                                color: status_of_transaction[transaction.status].color,
                                                text: status_of_transaction[transaction.status].text,
                                                icon: null
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3">
                    {transactionsSorted?.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                            onClick={() => setTransactionSelected(transaction.id)}
                        />
                    ))}
                </div>

                {transactionsSorted.length === 0 && (
                    <div className="text-center py-8">
                        <MdLibraryBooks size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Nenhuma transação encontrada</p>
                    </div>
                )}
            </div>
        </Bag>
    )
}