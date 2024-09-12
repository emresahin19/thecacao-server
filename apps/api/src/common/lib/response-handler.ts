import { StatusCode } from "../constants"; 

export function createResponse(status: boolean, data: any, isArray = false) {
    if (isArray) {
        return { status, items: data };
    }
    return { status, item: data };
}
