import { revalidatePath } from "next/cache";

async function main() {
    console.log("Revalidating paths...");
    revalidatePath("/guests");
    revalidatePath("/dashboard");
    revalidatePath("/");
    console.log("Revalidation triggered.");
}

main();
