export default function NumberInput({
    id,
    label,
    value,
    onChange,
    min,
    max,
    placeholder,
    disabled,
}) {
    return (
        <div className="flex flex-col gap-1 flex-1">
            <label className="" htmlFor={id}>
                {label}
            </label>
            <input
                type="number"
                id={id}
                name={id}
                className={`border w-full border-white rounded-[5px] py-0.2 px-2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                min={min}
                max={max}
                value={value}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}