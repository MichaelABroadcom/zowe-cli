/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { ProvisioningListMocks } from "../../../__resources__/ProvisioningListMocks";

jest.mock("@zowe/provisioning-for-zowe-sdk");
import {
    ListRegistryInstances,
    PerformAction,
    ProvisioningConstants
} from "@zowe/provisioning-for-zowe-sdk";
import { IHandlerParameters } from "@zowe/imperative";
import * as ActionHandler from "../../../../../src/provisioning/perform/action/Action.handler";
import * as ActionDefinition from "../../../../../src/provisioning/perform/action/Action.definition";
import {
    UNIT_TEST_ZOSMF_PROF_OPTS,
    getMockedResponse,
    UNIT_TEST_PROFILES_ZOSMF
} from "../../../../../../../__tests__/__src__/mocks/ZosmfProfileMock";

const DEFAULT_PARAMTERS: IHandlerParameters = {
    arguments: {
        $0: "bright",
        _: ["provisioning", "perform", "action"],
        ...UNIT_TEST_ZOSMF_PROF_OPTS
    },
    positionals: ["provisioning", "perform", "action"],
    response: getMockedResponse(),
    definition: ActionDefinition.ActionDefinition,
    fullDefinition: ActionDefinition.ActionDefinition,
    profiles: UNIT_TEST_PROFILES_ZOSMF
};

describe("perform action handler tests", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should be able to provision template", async () => {
        ListRegistryInstances.listFilteredRegistry = jest.fn(
            (session, zOSMFVersion, instanceId) => {
                return ProvisioningListMocks.LIST_REGISTRY_INSTANCES_RESPONSE;
            }
        );
        PerformAction.doProvisioningActionCommon = jest.fn(
            (session, zOSMFVersion, templateName) => {
                return {};
            }
        );
        const handler = new ActionHandler.default();
        const params = Object.assign({}, ...[DEFAULT_PARAMTERS]);
        params.arguments.zOSMFVersion = ProvisioningConstants.ZOSMF_VERSION;
        params.arguments.templateName = "some_name1";
        await handler.process(params);
        expect(PerformAction.doProvisioningActionCommon).toHaveBeenCalledTimes(
            1
        );
    });
});
