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

import { RefObject, useCallback, useRef } from "react";

import defaultDispatcher from "../../../../../dispatcher/dispatcher";
import { Action } from "../../../../../dispatcher/actions";
import { ActionPayload } from "../../../../../dispatcher/payloads";
import { TimelineRenderingType, useRoomContext } from "../../../../../contexts/RoomContext";
import { useDispatcher } from "../../../../../hooks/useDispatcher";
import { focusComposer } from "./utils";
import { ComposerFunctions } from "../types";

export function useWysiwygSendActionHandler(
    disabled: boolean,
    composerElement: RefObject<HTMLElement>,
    composerFunctions: ComposerFunctions,
) {
    const roomContext = useRoomContext();
    const timeoutId = useRef<number>();

    const handler = useCallback((payload: ActionPayload) => {
        // don't let the user into the composer if it is disabled - all of these branches lead
        // to the cursor being in the composer
        if (disabled || !composerElement.current) return;

        const context = payload.context ?? TimelineRenderingType.Room;

        switch (payload.action) {
            case "reply_to_event":
            case Action.FocusSendMessageComposer:
                focusComposer(composerElement, context, roomContext, timeoutId);
                break;
            case Action.ClearAndFocusSendMessageComposer:
                composerFunctions.clear();
                focusComposer(composerElement, context, roomContext, timeoutId);
                break;
            // TODO: case Action.ComposerInsert: - see SendMessageComposer
        }
    }, [disabled, composerElement, composerFunctions, timeoutId, roomContext]);

    useDispatcher(defaultDispatcher, handler);
}
