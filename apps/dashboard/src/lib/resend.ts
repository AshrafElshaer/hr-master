import {Resend} from "resend"
import {env} from "@hr-toolkit/env"

export const resend = new Resend(env.NEXT_PUBLIC_RESEND_API_KEY)