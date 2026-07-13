import type{ UnitType, Affiliation, Domain } from "../utils/types";
import { SIDC_MAP, FUNCTION_CODES } from "./constants";

export function resolveDomain(type: UnitType): Domain {
    if (type === "Drone") return "Air";
    if (type === "Akula") return "Subsurface";
    return "Sea";
}

export function getSIDC(type: UnitType, affiliation: Affiliation): string {
    const domain = resolveDomain(type);
    const id = SIDC_MAP.identity[affiliation];
    const dim = SIDC_MAP.dimension[domain];
    const func = FUNCTION_CODES[type];
    
    return `${SIDC_MAP.scheme}${id}${dim}${SIDC_MAP.status}${func}----`;
}