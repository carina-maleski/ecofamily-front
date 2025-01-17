import { redirect } from "react-router-dom";
import { destroy } from "../../service/Service";
import UserLogin from "../../model/UserLogin";

export default async function productDelete({ params }) {
  const token =
    sessionStorage.getItem("userLogin") !== null
      ? (JSON.parse(sessionStorage.getItem("userLogin") as string) as UserLogin)
          .token
      : null;

  if (token === null) return redirect("/login");

  await destroy(`produtos/${params.id}`, {
    headers: {
      Authorization: token,
    },
  });
  return redirect("/");
}
