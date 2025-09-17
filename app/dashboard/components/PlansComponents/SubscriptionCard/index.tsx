
import { TiCancel } from "react-icons/ti";
import { RiBarcodeFill } from "react-icons/ri";
import { IoCardOutline } from "react-icons/io5";
import { subscriptionsAttributes } from "../../interfaces";
import { Bag } from "@/components/bag";
import { subscription_description, subscription_situations } from "@/lib/subscriptionSituantions";
import { correctDate } from "@/lib/generalServices";
import { maskFunctions } from "@/lib/maskServices";
import parse from "html-react-parser";
import { Button } from "@/components/ui/button";

interface ISubscriptionCard {
    subscription: subscriptionsAttributes
    changePlan: Function
    changeCreditCard: Function
    openCancelSubscription: Function
    isRoot?: boolean
}

function addDays(date: Date, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

 /* ------------------------------------ */

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

   export const borderColors = {
    light: "#CCCCCC",
    dark: "rgb(68 68 68)",
  };
 
   /* ------------------------------------ */

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

export const SubscriptionCard: React.FC<ISubscriptionCard> = (props) => {
    const { subscription, changePlan, changeCreditCard, openCancelSubscription, isRoot } = props

    const title = "Meu plano atual"
    const description = "Gerencie aqui o seu plano e formas de pagamento"

    return (
        <Bag title={title} description={description} icon={<IoCardOutline color={secondary['light']} size={26} />}>
            <div className="space-y-6 p-4">
           
                <div className="bg-primary/15 rounded-lg p-4 border-l-4" 
                     style={{ borderLeftColor: subscription_situations[subscription.situation].color }}>
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                <h3 className="text-[18px] font-bold text-gray-900 uppercase">
                                    {subscription.plans?.name}
                                </h3>
                                {getStatus({
                                    color: subscription_situations[subscription.situation].color,
                                    text: subscription_situations[subscription.situation].text,
                                    icon: null
                                })}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {subscription_description[subscription.situation]} 
                                {subscription.situation === "paid-free" && (
                                    <span className="block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        Encerrando este período no dia {correctDate(addDays(subscription?.transactions?.[0]?.createdAt as any, 7), { month_in_extension: true })}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                                <span className="text-xl font-bold text-gray-900">
                                    {maskFunctions.currency.mask(subscription.value)}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">/ mês</span>
                            </div>
                            {!isRoot && (
                                <Button
                                    onClick={() => changePlan()}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                >
                                    {["expired", "canceled"].includes(subscription.situation) ? "Renovar assinatura" : "Alterar plano"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Benefícios do Plano */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">Benefícios do plano</h4>
                    </div>
                    <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                        {parse(subscription.plans?.description as any)}
                    </div>
                </div>

                {/* Informações de Cobrança */}
                {!["canceled", "expired"].includes(subscription.situation) && (
                    <div className="space-y-4">
                        {/* Próxima Fatura */}
                        {!!subscription.next_expire_at && (
                            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h4 className="font-semibold text-gray-900">Próxima fatura</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {correctDate(subscription.next_expire_at, { month_in_extension: true, no_have_time: true })} no valor de {maskFunctions.currency.mask(subscription.value)}
                                </p>
                            </div>
                        )}

                        {/* Método de Pagamento */}
                        {subscription.value > 0 && (
                            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <h4 className="font-semibold text-gray-900">Método de pagamento</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {subscription.card_mask !== "-" ? (
                                                <>
                                                    <IoCardOutline size={18} className="text-gray-600" />
                                                    <div>
                                                        <span className="text-sm font-medium capitalize text-gray-900">
                                                            {subscription.card_flag}
                                                        </span>
                                                        <span className="text-sm text-gray-500 ml-1">
                                                            ****{subscription.card_mask.replace(/\D/g, "")}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <RiBarcodeFill size={18} className="text-gray-600" />
                                                    <span className="text-sm font-medium capitalize text-gray-900">
                                                        Boleto Bancário
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {!isRoot && (
                                        <Button
                                            onClick={() => changeCreditCard()}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs hover:bg-purple-50 hover:border-purple-300"
                                        >
                                            Alterar método
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ações */}
                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={() => openCancelSubscription()}
                                variant="destructive"
                                className="gap-2 hover:bg-red-600"
                            >
                                <TiCancel size={16} />
                                Cancelar assinatura
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Bag>
    )
}