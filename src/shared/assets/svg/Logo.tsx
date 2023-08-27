export const Logo = ({
                         fill = 'black',
                         filled = true,
                         size = 20,
                         height = 20,
                         width = 20,
                         label = "",
                         ...props
                     }) => {
    return (
        <svg
            width={50}
            height={50}
            viewBox="0 0 512 512"
            fill={filled ? fill : 'none'}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <radialGradient id="RadialGradient1">
                    <stop offset="0%" stopColor="#fc7fff"/>
                    <stop offset="100%" stopColor="#ab3bff"/>
                </radialGradient>
            </defs>
            <path id={"rect1"} d="" stroke="none" fill="url(#RadialGradient1)" fillRule="evenodd"/>
            <path id={"rect1"} d="M 62.230 59.599 C 55.687 64.756, 56 60.767, 56 138.910 L 56 209.920 49.077 220.210 C 45.269 225.869, 39.194 235.395, 35.577 241.379 C 26.539 256.328, 26.541 258.311, 35.604 271.725 C 51.922 295.876, 80.753 327.156, 103.500 345.389 C 133.963 369.806, 169.718 388.611, 200.482 396.398 L 209.463 398.672 212.257 412.086 C 215.448 427.404, 218.175 433.754, 224.661 440.968 C 241.396 459.581, 270.604 459.581, 287.339 440.968 C 293.820 433.760, 296.552 427.405, 299.730 412.147 L 302.511 398.794 311.506 396.484 C 342.432 388.539, 378.271 369.652, 408.500 345.369 C 431.449 326.934, 460.067 295.893, 476.396 271.725 C 485.459 258.311, 485.461 256.328, 476.423 241.379 C 472.806 235.395, 466.731 225.869, 462.923 220.210 L 456 209.920 456 138.910 C 456 60.594, 456.323 64.636, 449.657 59.552 C 446.808 57.379, 445.274 57, 439.325 57 C 423.760 57, 400.117 63.443, 385.130 71.768 C 374.749 77.534, 364.070 86.035, 354.750 95.950 C 349.937 101.070, 346 105.657, 346 106.144 C 346 106.631, 343.225 105.628, 339.834 103.916 C 323.482 95.662, 301.691 88.742, 281.986 85.546 C 269.455 83.514, 242.545 83.514, 230.014 85.546 C 210.309 88.742, 188.518 95.662, 172.166 103.916 C 168.775 105.628, 166 106.631, 166 106.144 C 166 105.657, 162.063 101.070, 157.250 95.950 C 147.930 86.035, 137.251 77.534, 126.870 71.768 C 111.828 63.412, 88.188 56.987, 72.581 57.011 C 66.494 57.021, 65.041 57.384, 62.230 59.599 M 83 152.288 L 83 218.831 75.101 230.786 L 67.202 242.741 76.851 243.426 C 82.158 243.803, 90.860 244.989, 96.188 246.062 C 149.573 256.810, 199.533 301.754, 225.623 362.500 L 230.776 374.500 236.138 375.151 C 239.087 375.509, 248.025 375.802, 256 375.802 C 263.975 375.802, 272.913 375.509, 275.862 375.151 L 281.224 374.500 286.377 362.500 C 312.494 301.691, 362.372 256.821, 415.812 246.062 C 421.140 244.989, 429.857 243.802, 435.181 243.424 L 444.863 242.736 436.931 230.898 L 429 219.059 429 152.402 L 429 85.744 425.179 86.355 C 403.206 89.869, 378.957 106.232, 365.296 126.764 C 362.195 131.425, 358.272 136.083, 356.579 137.115 C 351.328 140.317, 348.052 139.554, 332.745 131.568 C 306.125 117.680, 283.443 111.754, 256.500 111.650 C 229.624 111.545, 207.503 117.181, 180.334 131.053 C 170.651 135.997, 163.586 138.999, 161.635 138.996 C 156.605 138.990, 152.724 135.811, 146.704 126.764 C 139.526 115.976, 125.831 102.901, 115.654 97.121 C 107.515 92.499, 94.366 87.543, 87.250 86.417 L 83 85.744 83 152.288 M 144.020 204.752 C 135.294 209.135, 133.342 220.478, 140.189 227.015 C 141.460 228.228, 149.188 232.546, 157.361 236.611 C 173.728 244.749, 177.725 245.569, 183.526 241.984 C 189.863 238.067, 191.700 229.050, 187.474 222.601 C 185.512 219.607, 153.502 202.999, 149.699 203.002 C 148.490 203.002, 145.934 203.790, 144.020 204.752 M 343.376 211.370 C 324.161 220.985, 322.513 222.495, 322.505 230.500 C 322.500 235.987, 324.555 239.670, 329.154 242.416 C 334.342 245.512, 338.760 244.506, 354.639 236.611 C 362.812 232.546, 370.540 228.228, 371.811 227.015 C 380.061 219.139, 375.375 205.233, 363.842 203.362 C 361.024 202.905, 357.670 204.217, 343.376 211.370 M 75.176 278.750 C 84.608 290.326, 110.077 315.459, 122 324.956 C 133.634 334.222, 150.339 345.376, 162.350 351.899 C 174.573 358.536, 197 367.844, 197 366.279 C 197 364.899, 186.556 346.252, 182.007 339.510 C 164.770 313.966, 142.102 293.543, 118.710 282.479 C 104.155 275.596, 86.379 271.072, 73.681 271.020 L 68.861 271 75.176 278.750 M 425 272.170 C 416.698 273.350, 400.285 278.827, 390.840 283.570 C 367.834 295.124, 345.691 315.776, 328.727 341.500 C 323.680 349.153, 315 364.913, 315 366.424 C 315 367.098, 324.183 363.781, 333.650 359.686 C 351.075 352.150, 372.217 339.120, 390 324.956 C 401.923 315.459, 427.392 290.326, 436.824 278.750 L 443.139 271 437.319 271.123 C 434.119 271.191, 428.575 271.662, 425 272.170 M 239.607 407 C 241.657 418.894, 243.089 421.864, 248.304 425.044 C 252.490 427.596, 259.510 427.596, 263.696 425.044 C 268.911 421.864, 270.343 418.894, 272.393 407 L 272.997 403.500 256 403.500 L 239.003 403.500 239.607 407" stroke="none"
                  fill="url(#RadialGradient1)" fillRule="evenodd"/>
        </svg>
    );
};
