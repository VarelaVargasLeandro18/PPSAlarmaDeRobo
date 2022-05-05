import { createContext } from "react";

declare interface user {
    email: string
};

export const UserContext = createContext<user>( { email: "" } );