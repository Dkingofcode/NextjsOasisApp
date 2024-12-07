import { NextResponse } from "next/server";


// export function middleware(request) {
//     console.log(request);

//     return NextResponse.redirect(new URL("/about", request.url));
// }

import {auth} from "@/app/_lib/auth";

const session = auth();

export const config = {
    matcher: ["/account", "/cabins"]
}