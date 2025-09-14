import React from "react";
import { Checkbox } from "./ui/checkbox";

interface IRadioButtonProps {
    checked: boolean
    onClick: () => void
    disabled?: boolean
    label?: string
    type: "radio" | "checkbox"
    icon?: any
    centerNoIcon?: boolean
    labelStyle?: React.CSSProperties
    background?: string;
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

export const MagicButton: React.FC<IRadioButtonProps> = (props) => {
    const { checked, onClick, disabled, label, type, icon, centerNoIcon = false, labelStyle = {}, background = secondary['light'] } = props

    return (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <label className={type} style={{ display: "flex", cursor: !disabled ? "pointer" : "default", alignItems: "center", margin: 0 }}>
                <Checkbox
                    disabled={disabled}
                    onClick={() => onClick()}
                    checked={checked}
                    style={{ display: "none" }}
                    onChange={() => { }}
                />
                {icon &&
                    <div style={{ display: "flex", marginRight: 15, justifyContent: "center", alignItems: "center", minWidth: 50, maxWidth: 50, minHeight: 50, maxHeight: 50, borderRadius: "50%", background: secondary['light'] }}>
                        {icon}
                    </div>
                }
                {label &&
                    <span style={{ whiteSpace: "nowrap", fontSize: 12, color: inactiveItens['light'], marginLeft: -5, textTransform: "uppercase", ...labelStyle }}>
                        {label}
                    </span>
                }
                {centerNoIcon && (
                    <span
                        style={{
                            background: disabled ? (checked ? inactiveItens["light"] : "#C4C4C4") : (checked ? secondary['light'] : "#C4C4C4"),
                            height: 16,
                            width: 16
                        }}
                        className="checkmark"
                    />
                )}
                {!centerNoIcon && (
                    <span
                        style={{
                            background: disabled ? (checked ? inactiveItens["light"] : "#C4C4C4") : (checked ? background : "#C4C4C4"),
                            height: 16,
                            width: 16,
                            top: "50%",
                            left: label ? undefined : "50%",
                            transform: label ? "translateY(-50%)" : "translate(-50%, -50%)"
                        }}
                        className="checkmark"
                    />
                )}

            </label>
        </div>
    )
}