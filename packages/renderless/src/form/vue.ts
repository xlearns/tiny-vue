/**
 * Copyright (c) 2022 - present TinyVue Authors.
 * Copyright (c) 2022 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

import {
  watchRules,
  computedAutoLabelWidth,
  created,
  resetFields,
  clearValidate,
  validate,
  validateField,
  getLabelWidthIndex,
  registerLabelWidth,
  deregisterLabelWidth,
  updateTip,
  bindDialogEvent,
  showTooltip,
  hideTooltip
} from './index'

export const api = [
  'state',
  'resetFields',
  'clearValidate',
  'validate',
  'validateField',
  'getLabelWidthIndex',
  'registerLabelWidth',
  'deregisterLabelWidth',
  'updateTip',
  'showTooltip',
  'hideTooltip'
]

export const renderless = (props, { computed, inject, provide, reactive, watch, onBeforeUnmount }, { vm, parent }) => {
  const api = {}
  const dialog = inject('dialog', null)

  const state = reactive({
    showAutoWidth: props.showAutoWidth,
    fields: [],
    timer: null,
    tooltipVisible: false,
    potentialLabelWidthArr: [],
    autoLabelWidth: computed(() => api.computedAutoLabelWidth()),
    isDisplayOnly: computed(() => props.displayOnly),
    hasRequired: computed(() => {
      if (props.rules) {
        return Object.values(props.rules).find((ruleOrRules) => {
          if (Array.isArray(ruleOrRules)) {
            return ruleOrRules.some((r) => r.required)
          } else {
            return ruleOrRules.required
          }
        })
      } else {
        return false
      }
    })
  })

  Object.assign(api, {
    state,
    updateTip: updateTip({ props, state }),
    computedAutoLabelWidth: computedAutoLabelWidth({ state }),
    created: created({ parent, state }),
    resetFields: resetFields({ props, state }),
    clearValidate: clearValidate(state),
    validate: validate({ props, state }),
    validateField: validateField(state),
    getLabelWidthIndex: getLabelWidthIndex(state),
    registerLabelWidth: registerLabelWidth({ api, state }),
    deregisterLabelWidth: deregisterLabelWidth({ api, state }),
    watchRules: watchRules({ api, props, state }),
    showTooltip: showTooltip({ vm, state }),
    hideTooltip: hideTooltip({ state })
  })

  api.created()

  provide('form', parent)

  provide('showAutoWidth', state.showAutoWidth)

  const unbindDialogEvent = bindDialogEvent({ api, dialog, state })

  onBeforeUnmount(unbindDialogEvent)

  watch(() => props.rules, api.watchRules)

  return api
}
