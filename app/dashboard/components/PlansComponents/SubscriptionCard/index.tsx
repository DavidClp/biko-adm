
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

    const title = "Meu plano atual".toUpperCase()
    const description = "Gerencie aqui o seu plano e formas de pagamento".toUpperCase()

    return (
        <Bag title={title} description={description} icon={<IoCardOutline color={secondary['light']} size={26} />}>
            <div className="flex" style={{ padding: 16, gap: 10, justifyContent: "space-between", borderBottom: `1px solid ${borderColors['light']}` }}>
                <div className="flex flex-col" style={{ gap: 5, flex: 1 }}>
                    <div className="flex" style={{ gap: 10 }}>
                        <p className="font-semibold font-size-[18px]">
                            {subscription.plans?.name?.toUpperCase()}
                        </p>
                        {getStatus({
                            color: subscription_situations[subscription.situation].color,
                            text: subscription_situations[subscription.situation].text,
                            icon: null
                        })}
                    </div>
                    <div style={{}}>
                        {subscription_description[subscription.situation]} {subscription.situation === "paid-free" ? `Encerrando este período no dia ${correctDate(addDays(subscription?.transactions?.[0]?.createdAt as any, 7), { month_in_extension: true })}` : ""}
                    </div>
                </div>
                <div className="flex flex-col" style={{ gap: 5, alignItems: "flex-end", whiteSpace: "nowrap" }}>
                    <div><b>{maskFunctions.currency.mask(subscription.value)}</b> / mês</div>
                    {!isRoot && (
                        <div onClick={() => changePlan()} style={{ color: secondary['light'], cursor: "pointer" }}>
                            {["expired", "canceled"].includes(subscription.situation) ? "Renovar assinatura" : "Alterar plano"}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col" style={{ padding: 16, gap: 10, borderBottom: !["canceled", "expired"].includes(subscription.situation) ? `1px solid ${borderColors['light']}` : "none" }}>
                <div style={{ fontWeight: 600 }}>Benefícios do plano</div>
                {parse(subscription.plans?.description as any)}
            </div>

            {!["canceled", "expired"].includes(subscription.situation) &&
                <>
                    {!!subscription.next_expire_at &&
                        <div className="flex flex-col" style={{ padding: 16, gap: 10, borderBottom: `1px solid ${borderColors['light']}` }}>
                            <div style={{ fontWeight: 600 }}>Próxima fatura</div>
                            {correctDate(subscription.next_expire_at, { month_in_extension: true, no_have_time: true })} no valor de {maskFunctions.currency.mask(subscription.value)}
                        </div>
                    }
                    {subscription.value > 0 &&
                        <div className="flex" style={{ padding: 16, gap: 10, alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${borderColors['light']}` }}>
                            <div className="flex flex-col" style={{ gap: 10 }}>
                                <div style={{ fontWeight: 600 }}>Método de pagamento</div>
                                {subscription.card_mask !== "-" && (
                                     <div className="flex" style={{ gap: 5, alignItems: "center" }}>
                                        <IoCardOutline size={20} color={inactiveItens['light']} />
                                        <div>
                                            <b style={{ textTransform: "capitalize" }}>
                                                {subscription.card_flag}
                                            </b>
                                            ****{subscription.card_mask.replace(/\D/g, "")}
                                        </div>
                                    </div>
                                )}
                                {subscription.card_mask === "-" && (
                                    <div className="flex" style={{ gap: 5, alignItems: "center" }}>
                                        <RiBarcodeFill size={20} color={inactiveItens['light']} />
                                        <b style={{ textTransform: "capitalize" }}>Boleto Bancário</b>
                                    </div>
                                )}
                            </div>
                            {!isRoot && (
                                <div onClick={() => changeCreditCard()} style={{ color: secondary['light'], cursor: "pointer" }}>
                                    Alterar método de pagamento
                                </div>
                            )}
                        </div>
                    }
                    <div className="flex flex-col" style={{ padding: 16, gap: 10, alignItems: "flex-end" }}>
                        <div>
                            <Button
                                onClick={() => openCancelSubscription()}
                                style={{ alignItems: "center", gap: 5, fontSize: 16 }}
                                variant='destructive'
                            >
                                <TiCancel size={20} />
                                <b>Cancelar assinatura</b>
                            </Button>
                        </div>
                    </div>
                </>
            }
        </Bag>
    )
}