export const Send = ({
                         fill = 'currentColor',
                         filled = true,
                         size = 20,
                         height = 20,
                         width = 20,
                         label = "",
                         ...props
                     }) => {
    return (
        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 24"
            fill={filled ? fill : 'none'}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path xmlns="http://www.w3.org/2000/svg" d="M20 4L3 11L10 14L13 21L20 4Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" fill="#FFFFFF"/>
        </svg>
    );
};
