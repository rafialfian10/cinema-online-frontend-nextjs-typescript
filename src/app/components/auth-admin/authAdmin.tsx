"use client";

// components next
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// components react
import { useEffect } from "react";

// types
import { UserAuth } from "@/types/userAuth";

export default function AuthAdmin(Component: any) {
  return function WithAuth(props: any) {
    // session
    const { data: session, status } = useSession();
    const userAuth: UserAuth | undefined = session?.user;

    const router = useRouter();

    useEffect(() => {
      if (status === "loading") {
        // Session is loading, do nothing
        return;
      }

      if (
        !userAuth ||
        userAuth?.data?.role !== "admin" ||
        status === "unauthenticated"
      ) {
        // signIn();
        router.push("/");
        return;
      }
    }, [status, userAuth, router]);

    if (status === "loading") {
      return null;
    }

    if (!userAuth || userAuth?.data?.role !== "admin") {
      return <p>Unauthorized</p>;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
