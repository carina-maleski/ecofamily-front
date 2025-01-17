import { useEffect, useState } from "react";
import UserLogin from "../../model/UserLogin";
import { AuthContext } from "../../context/UserContext";
import AuthProviderProps from "../../model/AuthProviderProps";
import { login } from "../../service/Service";
import Product from "../../model/Product";
import { toasts } from "../../util/toasts";

export default function AuthProvider({ children }: AuthProviderProps) {
  const initialUser: UserLogin = {
    id: 0,
    nome: "",
    email: "",
    foto: "",
    senha: "",
    tipo: -1,
    token: "",
  };

  const sessionUser: () => UserLogin = () => {
    return JSON.parse(
      sessionStorage.getItem("userLogin") || JSON.stringify(initialUser)
    ) as UserLogin;
  };

  const [user, setUser] = useState<UserLogin>(sessionUser());

  const [isLoading, setIsLoading] = useState(false);

  const localFavProducts: () => Product[] = () => {
    return JSON.parse(
      localStorage.getItem("favProducts") || JSON.stringify([])
    ) as Product[];
  };
  const [favProducts, setFavProducts] = useState<Product[]>(localFavProducts);

  const localCartProducts: () => Product[] = () => {
    return JSON.parse(
      localStorage.getItem("cartProducts") || JSON.stringify([])
    ) as Product[];
  };
  const [cartProducts, setCartProducts] =
    useState<Product[]>(localCartProducts);

  async function handleLogin(userLogin: UserLogin) {
    setIsLoading(true);
    try {
      const response = await login("usuarios/login", userLogin, setUser);
      toasts(`Olá, ${response.data.nome}`, "success");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toasts("Email ou senha incorretos", "error");
      setIsLoading(false);
    }
  }
  function handleLogout() {
    setUser(initialUser);
    sessionStorage.clear();
    location.pathname = "/";
  }

  useEffect(() => {
    const persistedUserLogin: UserLogin = JSON.parse(
      sessionStorage.getItem("userLogin") || JSON.stringify(initialUser)
    );
    if (persistedUserLogin.token !== "") setUser(persistedUserLogin);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        handleLogin,
        handleLogout,
        favProducts,
        setFavProducts,
        cartProducts,
        setCartProducts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
