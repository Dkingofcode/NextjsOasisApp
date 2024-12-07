"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";


export async function updateGuest(formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in")

    const nationalID = formData.get("nationalID");
    const [nationality, countryFlag] = formData.get("nationality").split("%");

    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))  throw new Error("Please provide a valid national ID")

    const updateData = { nationality, countryFlag, nationalID };
    
    const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

    if (error) {
        throw new Error("Guest could not be updated");
    }

    revalidatePath("/account/profile");
    console.log("Server action");
}

export async function createBooking(formData) {

    const session = await auth();

    if (!session) throw new Error("You must be logged in");

    const newBooking = {
        ...bookingData,
        guestId: session.user.guestId,
        numGuests: Number(formData.get("numGuests")),
        observations: formData.get("observations").slice(0, 1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: "unconfirmed",
    };

    const { error } = await supabase.from("bookings").insert([newBooking]);

    if (error) throw new Error("Booking could not be created");

    revalidatePath(`/cabins/${bookingData.cabinId}`);

    redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
    await new Promise((res) => setTimeout(res, 2000)); 

    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const guestBookings = await getBookings(session.user.guestId);

    const guestBookingIds = guestBookings.map((booking) => booking.id);
  
    if (!guestBookingIds.includes(bookingId)) throw new Error("You are not allowed to delete this booking");

    const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", session.user.guestId); 

    if (error) throw new Error("Booking could not be deleted");

    revalidatePath("/accounts/reservations");
}

export async function updateBooking(id, updatedFields) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const guestBookings = await getBookings(session.user.guestId);

    const guestBookingIds = guestBookings.map((booking) => booking.id);
  
    if (!guestBookingIds.includes(bookingId)) throw new Error("You are not allowed to delete this booking");

     const updateData = {
        numGuests: Number(formData.get("numGuests")),
        observations: formData.get("observations").slice(0, 1000),
     };

     const bookingId = Number(formData.get("bookingId"));

    const {  error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

    if (error) {
        throw new Error("Booking could not be updated");
    }


    revalidatePath("/accounts/reservations");
    
    redirect("/accounts/reservations");
}

export async function signInAction() {
    await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
    await signOut({ redirectTo: "/" })
}