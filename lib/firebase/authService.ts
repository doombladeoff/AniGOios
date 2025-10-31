import { EmailAuthProvider, linkWithCredential, sendEmailVerification } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../firebase";

/**
 * Добавление пароля к аккаунту, вошедшему через Google
 * @param {string} newPassword - Новый пароль.
 */
export const addPasswordToGoogleAccount = async (newPassword: string) => {
    const user = auth.currentUser;

    if (!user || !user.email) {
        console.error("Ошибка: Пользователь не вошел или не имеет email.");
        return;
    }

    try {
        const credential = EmailAuthProvider.credential(
            user.email,
            newPassword
        );

        const userCredential = await linkWithCredential(user, credential);

        alert('✅ Пароль успешно установлен! Теперь вы можете входить как через Google, так и по Email/Паролю.');

        console.log('Обновленные провайдеры:', userCredential.user.providerData);

    } catch (error: any) {
        console.error('Ошибка при установке пароля:', error.code, error.message);

        if (error.code === 'auth/credential-already-in-use') {
            alert('Ошибка: Этот email/пароль уже привязан к другому аккаунту Firebase.');
        } else if (error.code === 'auth/requires-recent-login') {
            alert('В целях безопасности, пожалуйста, войдите снова через Google и попробуйте установить пароль еще раз.');
        } else {
            alert(`Не удалось установить пароль. Ошибка: ${error.message}`);
        }
    }
};

/**
 * Отправляет письмо для верификации почты текущему пользователю.
 */
export const verifyEmail = async () => {
    const user = auth.currentUser;

    if (!user) {
        Alert.alert('Ошибка', 'Пользователь не вошел в систему.');
        return;
    }

    if (user.emailVerified) {
        Alert.alert('Успех', 'Ваша почта уже подтверждена!');
        return;
    }

    try {
        await sendEmailVerification(user);

        Alert.alert(
            'Письмо отправлено!',
            `Мы отправили письмо на адрес ${user.email}. \n\nПожалуйста, проверьте свою почту и перейдите по ссылке для подтверждения. \n\nПисьмо может быть в спаме.`,
        );

    } catch (error: any) {
        console.error('Ошибка при отправке верификации:', error.code, error.message);
        Alert.alert('Ошибка', `Не удалось отправить письмо: ${error.message}`);
    }
};

