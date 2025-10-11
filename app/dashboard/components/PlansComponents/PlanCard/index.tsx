import React from "react";
import parse from "html-react-parser";
import { IPlan } from "@/hooks/use-subscriptions";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaBoxes } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { FaToilet } from "react-icons/fa";
import { TbHandStop } from "react-icons/tb";
import { IoIosDesktop } from "react-icons/io";
import { BiCar, BiCloset, BiHome } from "react-icons/bi";
import { IoAirplaneOutline, IoBed } from "react-icons/io5";
import { GiBathtub, GiHomeGarage, GiSofa } from "react-icons/gi";
import { FaFaucet, FaLayerGroup, FaLightbulb, FaPalette, FaWarehouse } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService, MdOutdoorGrill, MdOutlinePedalBike, MdOutlineStarOutline, MdPool } from "react-icons/md";
import { maskFunctions } from "@/lib/maskServices";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface IPlanCard {
    plan: IPlan
    selected: boolean
    onClick: Function
}
/* ------------------------------------ */


export const background = {
    light: "#f8f8f8",
    dark: "#1B191B",
};

/* ------------------------------------ */

const getPartIntAndDecimal = (value: string) => {
    let partInt = value.split(",")[0].replace(/\D+/g, "")
    let partDecimal = value.split(",")[1].replace(/\D+/g, "")

    return (
        <>
            R$ <b style={{ fontSize: 36 }}>{partInt},</b>{partDecimal}
        </>
    )
}

export const PlanCard: React.FC<IPlanCard> = (props) => {
    const { plan, selected, onClick } = props

    return (
        /*  ${props => css`
             border: 2px solid ${primary[props.theme as themeTypes]};
             background: ${primary[props.theme as themeTypes]};
             box-shadow:0.125rem 0.125rem 0.5rem ${shadowColor[props.theme as themeTypes]};
         `}
         ${props => props.selected && css`
             border: 2px solid ${secondary[props.theme as themeTypes]};
         `} */
        <div
            className={`rounded-md flex flex-col mb-5 cursor-pointer p-5 min-w-[300px] flex-1 ${selected ? "border-2 border-primary" : ""}`}
            style={{ boxShadow: "0.125rem 0.125rem 0.5rem rgba(0,0,0,0.1)" }}
            onClick={() => onClick(plan?.id)}
        >
            <div style={{ display: "flex", whiteSpace: "nowrap", justifyContent: "flex-end", gap: 10 }}>
                {selected &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: 20, maxWidth: 20, minHeight: 20, maxHeight: 20, borderRadius: "50%", boxShadow: "rgb(187 187 187 / 70%) 0.125rem 0.125rem 0.5rem" }}>
                        <AiFillCheckCircle style={{ width: 20, height: 20 }} className="text-primary" />
                    </div>}
                {!selected && <div style={{ width: 20, height: 20, borderRadius: "50%", boxShadow: "rgb(187 187 187 / 70%) 0.125rem 0.125rem 0.5rem" }} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20, gap: 10 }}>
                <div className="bg-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: 50, maxWidth: 50, minHeight: 50, maxHeight: 50, borderRadius: "50%" }}>
                    <PlanIcons type={plan?.icon || ''} size={35} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="text-primary" style={{ fontWeight: 600, fontSize: 22, textAlign: "center" }}>{plan?.name?.toUpperCase()}</div>
                    <div style={{ opacity: 0.5, marginTop: -5, }}>Plano mensal</div>
                    <div className="mt-2 mb-1">
                    <Badge variant="outline" className={`${"border-primary text-primary"
                        }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        30 dias grátis
                    </Badge>
                </div>
                </div>
                <div className="text-primary" style={{ fontWeight: 600, fontSize: 22, marginTop: -10 }}>
                    {getPartIntAndDecimal(maskFunctions.currency.mask(plan?.value))}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {parse(plan?.description || '')}
            </div>
        </div>
    )
}

export const PlanIcons: React.FC<{ type: string, size: number, opacity?: number }> = ({ size, type, opacity = 1 }) => {
    if (type === "FaCar") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <BiCar size={size} />
            </div>
        )
    }
    else if (type === "FaAirPlane") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity, rotate: "-45deg" }}>
                <IoAirplaneOutline size={size} />
            </div>
        )
    }
    else if (type === "TbHandStop") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <TbHandStop size={size} />
            </div>
        )
    }
    else if (type === "MdOutlinePedalBike") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <MdOutlinePedalBike size={size} />
            </div>
        )
    }
    else if (type === "FaStar") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <MdOutlineStarOutline size={size} />
            </div>
        )
    }
    return <></>
}