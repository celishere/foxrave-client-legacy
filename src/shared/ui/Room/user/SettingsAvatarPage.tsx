import { useContext, useRef, useState } from "react";

import { Button, Grid, Spacer, Text } from "@nextui-org/react";
import { Crop, PixelCrop, ReactCrop } from "react-image-crop";

import toast, { Toaster } from "react-hot-toast";

import { API_URL } from "foxrave/shared/http";
import { Context } from "foxrave/pages/_app";

import { useDebounceEffect } from "foxrave/shared/types/useDebounceEffect";
import { canvasPreview } from "foxrave/shared/types/canvasPreview";

import AuthService from "foxrave/shared/services/AuthService";

import styles from 'foxrave/shared/assets/css/Setup.module.css';

import SocketHelper, { UserState } from "foxrave/shared/types/socketHelper";
import RoomStore from "foxrave/shared/store/roomStore";

import 'react-image-crop/dist/ReactCrop.css'

interface SettingsPageProps {
    onQuit: () => void;
}

export default function SettingsAvatarPage({ onQuit }: SettingsPageProps) {
    const placeholder = `${API_URL}/storage/avatar/1`;

    const { store } = useContext(Context)

    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50,
    });

    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [scale, setScale] = useState(1)

    const imgRef = useRef<HTMLImageElement>(null)
    const blobUrlRef = useRef('')

    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                await canvasPreview (
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    0
                )
            }
        }, 100, [completedCrop, scale]
    )

    const handleAvatarSelect = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            // @ts-ignore
            setSelectedAvatar(e.target.result);
        };

        reader.readAsDataURL(file);
    };

    function onDownloadCropClick() {
        if (!previewCanvasRef.current) {
            throw new Error('Crop canvas does not exist')
        }

        previewCanvasRef.current.toBlob(async (blob) => {
            if (!blob) {
                throw new Error('Failed to create blob')
            }

            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
            }

            blobUrlRef.current = URL.createObjectURL(blob)

            const { readAndCompressImage } = (await import('browser-image-resizer'));

            readAndCompressImage(new File([blob], `${store.user.id}.png`), {
                quality: 1,
                maxWidth: 100,
                maxHeight: 100
            })
                .then((blob) => {
                    AuthService.uploadAvatar(blob, `${store.user.id}.png`)
                        .then(response => {
                            store.setUser(response.data.user)
                            toast.success(response.data.message)

                            SocketHelper.updateUser(RoomStore.getInstance().socket, UserState.AVATAR, store.user.id)
                        })
                        .catch(error => {
                            toast.error("Произошла ошибка.")
                            console.log(error)
                        })
                })
        })
    }

    const handleAvatarUpload = () => {
        if (completedCrop && previewCanvasRef.current) {
            toast("Загрузка...")

            onDownloadCropClick()
        } else {
            toast.error("Обрежь картинку перед загрузкой!")
        }
    };

    return (
        <>
            <Toaster/>
            <label htmlFor="avatarInput" className={styles.fileInputLabel}>
                <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className={styles.fileInput}
                />
                Выбрать файл
            </label>

            <ReactCrop
                aspect={1}
                crop={crop}
                onChange={(crop, percentCrop) => setCrop(crop)}
                onComplete={(c) => setCompletedCrop(c)}
                className={ styles.settingsAvatarSet }
            >
                <img
                    crossOrigin="anonymous"
                    ref={imgRef}
                    src={ selectedAvatar ? selectedAvatar : placeholder }
                    alt={'Crop'}
                    className={ styles.settingsAvatarSetImage }
                />
            </ReactCrop>

            {
                !!completedCrop && (
                    <>
                        <Grid.Container justify={"center"}>
                            <Text b size={23} color="inherit" css={{ d: "flex" }}>
                                Результат
                            </Text>
                        </Grid.Container>

                        <Spacer y={0.1}/>

                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                margin: '0 auto',
                                border: '3px solid rgba(163, 43, 255, 0.82)',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                width: "200px",
                                height: "200px",
                            }}
                        />

                        <Spacer y={1}/>

                        <div className={ styles.button }>
                            <Button onPress={() => handleAvatarUpload()} size="md" rounded flat>
                                Загрузить
                            </Button>
                        </div>
                    </>
                )
            }

            <div className={ styles.buttonQuit }>
                <Button onPress={ () => onQuit() } color="secondary" size="lg" rounded flat>
                    Выйти
                </Button>
            </div>
        </>
    )
}