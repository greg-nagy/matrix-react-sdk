/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import EventEmitter from "events";
import { SimpleObservable } from "matrix-widget-api";

import { Playback, PlaybackState } from "../../src/audio/Playback";
import { PlaybackClock } from "../../src/audio/PlaybackClock";
import { UPDATE_EVENT } from "../../src/stores/AsyncStore";

type PublicInterface<T> = {
    [P in keyof T]: T[P];
};

export const createTestPlayback = (): Playback => {
    const eventEmitter = new EventEmitter();

    return {
        thumbnailWaveform: [1, 2, 3],
        sizeBytes: 23,
        waveform: [4, 5, 6],
        waveformData: new SimpleObservable<number[]>(),
        destroy: jest.fn(),
        play: jest.fn(),
        prepare: jest.fn(),
        pause: jest.fn(),
        stop: jest.fn(),
        toggle: jest.fn(),
        skipTo: jest.fn(),
        isPlaying: false,
        clockInfo: createTestPlaybackClock(),
        currentState: PlaybackState.Stopped,
        emit: (event: PlaybackState, ...args: any[]): boolean => {
            eventEmitter.emit(event, ...args);
            eventEmitter.emit(UPDATE_EVENT, event, ...args);
            return true;
        },
        // EventEmitter
        on: eventEmitter.on.bind(eventEmitter),
        once: eventEmitter.once.bind(eventEmitter),
        off: eventEmitter.off.bind(eventEmitter),
        addListener: eventEmitter.addListener.bind(eventEmitter),
        removeListener: eventEmitter.removeListener.bind(eventEmitter),
        removeAllListeners: eventEmitter.removeAllListeners.bind(eventEmitter),
        getMaxListeners: eventEmitter.getMaxListeners.bind(eventEmitter),
        setMaxListeners: eventEmitter.setMaxListeners.bind(eventEmitter),
        listeners: eventEmitter.listeners.bind(eventEmitter),
        rawListeners: eventEmitter.rawListeners.bind(eventEmitter),
        listenerCount: eventEmitter.listenerCount.bind(eventEmitter),
        eventNames: eventEmitter.eventNames.bind(eventEmitter),
        prependListener: eventEmitter.prependListener.bind(eventEmitter),
        prependOnceListener: eventEmitter.prependOnceListener.bind(eventEmitter),
    } as PublicInterface<Playback> as Playback;
};

export const createTestPlaybackClock = (): PlaybackClock => {
    return {
        durationSeconds: 31,
        timeSeconds: 41,
        liveData: new SimpleObservable<number[]>(),
        populatePlaceholdersFrom: jest.fn(),
        flagLoadTime: jest.fn(),
        flagStart: jest.fn(),
        flagStop: jest.fn(),
        syncTo: jest.fn(),
        destroy: jest.fn(),
    } as PublicInterface<PlaybackClock> as PlaybackClock;
};
