import { useState } from 'react';

const PasswordInput = ({ label, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label>{label} </label>
            <input
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                required
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
        </div>
    );
};

export default PasswordInput;
