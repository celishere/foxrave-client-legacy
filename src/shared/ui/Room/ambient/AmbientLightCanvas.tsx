import React, { useEffect, useRef, useState } from "react";

import { MediaPlayerElement } from "vidstack";

import PlayerStore from "foxrave/shared/store/playerStore";

import styles from "foxrave/shared/assets/css/Room.module.css";

export const AmbientLightCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [playerElement, setPlayerElement] = useState<any>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!canvas || !context) {
            return;
        }

        const FRAMERATE = 30;
        let intervalId: number | undefined;

        function repaintAmbilight() {
            if (playerElement !== null && context !== null && context !== undefined) {
                context.drawImage(playerElement, 0, 0, 300, 144);
            }
        }

        function startAmbilightRepaint() {
            intervalId = window.setInterval(repaintAmbilight, 1000 / FRAMERATE);
        }

        function stopAmbilightRepaint() {
            clearInterval(intervalId);
        }

        repaintAmbilight();

        const listener = (player: HTMLVideoElement): void => {
            if (player === null) {
                return
            }

            console.log('[Ambient light] Got element', player)

            setPlayerElement(player)

            repaintAmbilight()
            startAmbilightRepaint()

            console.log('[Ambient light] Repaint, please')
        }

        const playListener = (player: MediaPlayerElement): void => {
            console.log('[Ambient light] Play')

            repaintAmbilight()
            startAmbilightRepaint()
        }

        const pauseListener = (player: MediaPlayerElement): void => {
            console.log('[Ambient light] Stop')

            stopAmbilightRepaint()
        }

        const seekedListener = (player: MediaPlayerElement): void => {
            console.log('[Ambient light] Seeked')

            repaintAmbilight()
        }

        PlayerStore.getInstance().addListener(listener)
        PlayerStore.getInstance().addPlayListener(playListener)
        PlayerStore.getInstance().addStopListener(pauseListener)
        PlayerStore.getInstance().addSeekedListener(seekedListener)

        console.log("[Ambient light] Init")

        return () => {
            PlayerStore.getInstance().removeListener(listener)
            PlayerStore.getInstance().removePlayListener(playListener)
            PlayerStore.getInstance().removeStopListener(pauseListener)
            PlayerStore.getInstance().removeSeekedListener(seekedListener)
        }
    }, [playerElement]);

    return <canvas className={ styles.ambilight } ref={canvasRef} />;
};