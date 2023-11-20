import { ButtonContainer } from "./buttonStyle";

interface ButtonProps {
    children: React.ReactNode;
    size?: "small" | "medium" | "bigboi"
    onClick: () => void
}

const Button: React.FC<ButtonProps> = ({children, size = "medium", onClick}) => {
    return(
        <ButtonContainer type="button"
                className={`${
                    size== "small" ? "small" : size=="medium" ? "medium" : "bigboi"
                }`}
                onClick={onClick}
                >
            {children}
        </ButtonContainer>
    )
}
export default Button;