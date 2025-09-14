import React from "react";
import { PlanCard } from "../../../../PlansComponents/PlanCard";
import { themeTypes } from "@/app/dashboard/components/interfaces";
import { IPlan } from "@/hooks/use-subscriptions";

interface IChoosePlan {
    plans: IPlan[]
    planSelected: string | null
    setPlanSelected: Function
}

export const ChoosePlan: React.FC<IChoosePlan> = (props) => {
    const { planSelected, plans, setPlanSelected } = props

    return (
        <div>
            {plans.map((plan) => {
                if (plan.active) return (
                    <PlanCard
                        plan={plan}
                        selected={planSelected === plan.id}
                        onClick={setPlanSelected}
                        key={plan.id}
                    />
                )
                else return null
            })}
        </div>
    )
}