<template>
  <Sidebar v-model:visible="editInputModal" position="right" class="n-form__modal">
    <div class="n-form__modal-title">Edit Element</div>
    <div class="n-form__modal-content">
      <div class="form-group" v-if="!updateField.children">
        <label for="newFieldLabel">Label</label>
        <input type="text" class="form-control" v-model="updateField.label" />
      </div>
      <div class="form-group" v-if="updateField.helpText">
        <label for="newFieldLabel">Help Text</label>
        <input type="text" class="form-control" v-model="updateField.helpText" />
      </div>

      <div class="form-group" v-if="updateField.options && updateField.options.length > 0">
        <label for="newFieldLabel">Options</label>
        <Chips v-model="updateField.options" />
      </div>
      <div class="form-group" v-if="updateField.validation && !updateField.children">
        <div class="d-flex align-items-center">
          <prime-checkbox
            v-model="updateField.isUpdateFieldValidation"
            :binary="true"
            @input="requiredHandle(updateField)"
          />
          <label for="requiredFor" class="ms-2"> Required </label>
        </div>
      </div>
      <div class="form-group" v-if="updateField.validation"></div>
      <div
        class="form-group"
        v-if="updateField.children"
        v-for="(children, index) in updateField.children"
      >
        <label for="newFieldLabel">Child Item {{ index + 1 }} Label</label>
        <input type="text" class="form-control" v-model="children.name" />
        <label for="newFieldLabel" class="mt-3" v-if="children.helpText"
          >Child Item {{ index + 1 }} Help Text</label
        >
        <input
          type="text"
          class="form-control"
          v-if="children.helpText"
          v-model="children.helpText"
        />

        <div class="d-flex align-items-center mt-3" v-if="children.validation">
          <prime-checkbox
            v-model="children.isUpdateFieldValidation"
            :binary="true"
            @input="requiredHandle(updateField, children)"
          />
          <label for="requiredFor" class="ms-2"> Required </label>
        </div>
      </div>
    </div>
  </Sidebar>

  <div class="n-form">
    <div class="n-form-side">
      <div class="n-form-side__title">Drag Element to Form</div>
      <div class="n-form-side__wrapper">
        <div
          v-for="(field, index) in inputTypes"
          :key="index"
          class="n-form-side__item"
          draggable="true"
          @dragstart="dragStart($event, field)"
        >
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
            class="n-form-side__item-svg"
          >
            <path
              d="M510.3,252.4l-81.7-64.4c-2-1.6-4.9-1.2-6.5,0.8c-0.6,0.8-1,1.8-1,2.9V233H279.1V90.9h41.5c3.8,0,6-4.5,3.6-7.5L259.7,1.8
		c-1.5-2-4.4-2.4-6.4-0.8c-0.3,0.2-0.6,0.5-0.8,0.8l-64.5,81.7c-1.6,2-1.2,4.9,0.8,6.5c0.8,0.6,1.8,1,2.9,1H233V233H90.9v-41.5
		c0-3.8-4.5-6-7.5-3.6L1.8,252.4c-2,1.5-2.4,4.4-0.8,6.4c0.2,0.3,0.5,0.6,0.8,0.8l81.6,64.5c3,2.4,7.5,0.3,7.5-3.6v-41.4h142.1
		v142.1h-41.5c-3.8,0-6,4.5-3.6,7.5l64.5,81.6c1.9,2.4,5.4,2.4,7.2,0l64.5-81.6c2.4-3,0.3-7.5-3.6-7.5h-41.3V279.1h142.1v41.5
		c0,3.8,4.5,6,7.5,3.6l81.6-64.5c2-1.6,2.4-4.5,0.8-6.6C510.8,252.8,510.6,252.6,510.3,252.4z"
            />
          </svg>
          <span class="n-form-side__item-text">
            {{ field.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="n-form-wrapper">
      <div class="n-form-main-title">Create Your Form</div>
      <div class="n-form-content">
        <div class="n-form-content__top">
          <div class="n-form-content__top-title">
            <span v-if="!isFormTitleChanging" @click="isFormTitleChanging = true">
              {{ yourFormTitle }}
            </span>
            <input v-if="isFormTitleChanging" type="text" v-model="yourFormTitle" />
            <div class="n-form-content__top-icon" @click="changeFormTextHandle">
              <i class="pi pi-pencil" v-if="!isFormTitleChanging"></i>
              <i class="pi pi-check" v-if="isFormTitleChanging"></i>
            </div>
          </div>
        </div>
        <div class="n-form-content__area" @dragover.prevent @drop="dropField">
          <div class="n-form-content__area-field" v-if="items.length > 0">
            <FormKit type="form" v-model="model">
              <draggable :list="items" item-key="token" class="list-group" ghost-class="ghost">
                <template #item="{ element }">
                  <transition-group tag="div" name="flip-list">
                    <component
                      :is="element.isHtml ? element.type : 'FormKit'"
                      :key="element.token"
                      :name="element.token"
                      :id="element.token"
                      :type="element.type"
                      :label="element.label"
                      :help="element.helpText"
                      :options="element.options"
                      :class="element.class"
                      :validation="element.validation"
                      :sections-schema="{
                        suffix: {
                          $el: 'span',
                          attrs: {
                            class: 'icon-group',
                            'data-key': '$id'
                          },
                          children: [
                            {
                              $el: 'i',
                              attrs: {
                                class: 'pi pi-pencil',
                                'data-key': '$id',
                                onClick: updateItem
                              }
                            },
                            {
                              $el: 'i',
                              attrs: {
                                class: 'pi pi-trash',
                                'data-key': '$id',
                                onClick: removeItem
                              }
                            }
                          ]
                        }
                      }"
                    >
                      <template #default v-if="element.isHtml === true">
                        <div v-if="element.type !== 'div' && element.class !== 'form-line'">
                          <span>{{ element.label }}</span>
                          <div class="icon-group">
                            <i class="pi pi-pencil" @click="updateItem(element)"></i>
                            <i class="pi pi-trash" @click="removeItem(element)"></i>
                          </div>
                        </div>
                        <div v-else-if="element.class === 'form-line'">
                          <div class="icon-group">
                            <i class="pi pi-trash" @click="removeItem(element)"></i>
                          </div>
                        </div>
                        <div v-else>
                          <div v-for="item in element.children">
                            <formKit
                              :name="item.token"
                              :id="item.token"
                              :type="item.type"
                              :label="item.name"
                              :help="item.helpText"
                              :validation="item.validation"
                            ></formKit>
                          </div>
                          <div class="icon-group">
                            <i class="pi pi-pencil" @click="updateItem(element)"></i>
                            <i class="pi pi-trash" @click="removeItem(element)"></i>
                          </div>
                        </div>
                      </template>
                    </component>
                  </transition-group>
                </template>
              </draggable>
              <FormKit
                type="checkbox"
                label="Do you agree to our terms of service?"
                name="terms"
                :value="true"
                validation="accepted"
                validation-visibility="dirty"
              >
              </FormKit>
            </FormKit>
          </div>
          <div class="n-form-content__area-field" v-if="items.length === 0">
            <div class="n-form-empty">
              <svg
                class="n-form-empty__icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M831.7 369.4H193.6L64 602v290.3h897.2V602L831.7 369.4zM626.6 604.6c0 62.9-51 113.9-114 113.9s-114-51-114-113.9H117.5l103.8-198h582.5l103.8 198h-281zM502.2 131h39.1v140.6h-39.1zM236.855 200.802l27.647-27.647 99.419 99.418-27.648 27.648zM667.547 272.637l99.418-99.419 27.648 27.648-99.418 99.418z"
                />
              </svg>
              <div class="n-form-empty__text">Drag from the left menu</div>
            </div>
          </div>
        </div>
        <div class="container mt-5">
          <div class="col-md-6">
            <pre wrap>{{ model }}</pre>
          </div>
          <div class="col-md-6">
            <pre wrap>{{ items }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { token } from '@formkit/utils'
import draggable from 'vuedraggable'
import Sidebar from 'primevue/sidebar'
import Dialog from 'primevue/dialog'
import Chips from 'primevue/chips'
import Checkbox from 'primevue/checkbox'

export default {
  components: {
    draggable,
    'prime-dialog': Dialog,
    Chips,
    Sidebar,
    'prime-checkbox': Checkbox
  },
  data() {
    return {
      yourFormTitle: 'Untitled Form',
      isFormTitleChanging: false,
      editInputModal: false,
      updateField: {},

      model: {},
      items: [],
      inputTypes: [
        {
          name: 'Title',
          label: 'Title',
          type: 'h1',
          message: 'Title',
          isHtml: true
        },
        {
          name: 'Paragraph',
          label: 'Paragraph',
          type: 'p',
          message: 'Paragraph',
          isHtml: true
        },
        {
          name: 'Add Line',
          label: 'Add Line',
          type: 'div',
          class: 'form-line',
          message: '',
          isHtml: true
        },
        {
          name: 'Text Field',
          label: 'Text Field',
          type: 'text',
          helpText: 'text help text',
          validation: 'none'
        },
        {
          name: 'Email Field',
          label: 'Email Field',
          type: 'email',
          helpText: 'email text text',
          validation: 'none'
        },
        {
          name: 'Dropdown',
          label: 'Dropdown',
          type: 'select',
          helpText: 'select help text',
          options: ['Monaco', 'Vatican City', 'Maldives', 'Tuvalu'],
          validation: 'none'
        },

        {
          name: 'Name Surname',
          label: 'Name Surname',
          type: 'div',
          isHtml: true,
          class: 'group-column',
          children: [
            {
              token: token(),
              name: 'Name',
              label: 'Name',
              type: 'text',
              helpText: 'help text text',
              validation: 'none'
            },
            {
              token: token(),
              name: 'Surname',
              label: 'Surname',
              type: 'text',
              helpText: 'help text text',
              validation: 'none'
            }
          ]
        },
        {
          name: 'Address',
          label: 'Address',
          type: 'div',
          isHtml: true,
          class: 'group-column-address',
          children: [
            {
              token: token(),
              name: 'Address',
              label: 'Address Line 1',
              type: 'text',
              validation: 'none'
            },
            {
              token: token(),
              name: 'Address Line 2',
              label: 'Address Line 2',
              type: 'text'
            },
            {
              token: token(),
              name: 'District',
              label: 'District',
              type: 'text'
            },
            {
              token: token(),
              name: 'City',
              label: 'City',
              type: 'text',
              validation: 'none'
            },
            {
              token: token(),
              name: 'Country',
              label: 'Country',
              type: 'text',
              helpText: 'address help text',
              validation: 'none'
            }
          ]
        },
        {
          name: 'Date Field',
          label: 'Date Field',
          type: 'date',
          helpText: 'date field help text',
          validation: 'none'
        },
        {
          name: 'Time Field',
          label: 'Time Field',
          type: 'time',
          helpText: 'time field help text',
          validation: 'none'
        },
        {
          name: 'Phone Number Field',
          label: 'Phone Number Field',
          type: 'tel',
          helpText: 'tel field help text',
          validation: 'none'
        },
        {
          name: 'Textarea Field',
          label: 'Textarea Field',
          type: 'textarea',
          helpText: 'Textarea help text',
          validation: 'none'
        },
        {
          name: 'File Field',
          label: 'File Field',
          type: 'file',
          helpText: 'File help text',
          validation: 'none'
        },
        {
          name: 'Radio Field',
          label: 'Radio Field',
          type: 'radio',
          helpText: 'Radio help text',
          options: ['Monaco', 'Vatican City', 'Maldives', 'Tuvalu'],
          validation: 'none'
        }
      ]
    }
  },
  methods: {
    changeFormTextHandle() {
      this.isFormTitleChanging = !this.isFormTitleChanging
    },
    dragStart(event, field) {
      event.dataTransfer.setData('text/plain', JSON.stringify(field))
    },
    dropField(event) {
      event.preventDefault()
      const field = JSON.parse(event.dataTransfer.getData('text/plain'))
      this.items.push({
        token: token(),
        type: field.type,
        label: field.label,
        helpText: field.helpText,
        isHtml: field.isHtml,
        message: field.message,
        options: field.options,
        children: field.children,
        class: field.class,
        validation: field.validation
      })
    },

    removeItem(e) {
      if (e.isHtml) {
        this.items = this.items.filter((item) => item.token !== e.token)
      } else {
        e.preventDefault()
        const key = e.target.getAttribute('data-key')
        this.items = this.items.filter((item) => item.token !== key)
      }
    },
    updateItem(e) {
      this.editInputModal = true

      if (e.isHtml) {
        const filteredItem = this.items.filter((item) => item.token === e.token)

        if (filteredItem.length > 0) {
          this.updateField = filteredItem[0]
          this.updateField.isUpdateFieldValidation = false
        } else {
          this.updateField = null
        }
      } else {
        e.preventDefault()
        this.editInputModal = true
        const key = e.target.getAttribute('data-key')
        const filteredItem = this.items.filter((item) => item.token === key)

        if (filteredItem.length > 0) {
          this.updateField = filteredItem[0]
          this.updateField.isUpdateFieldValidation = false
        } else {
          this.updateField = null
        }
      }
    },
    requiredHandle(e, children) {
      if (e.isUpdateFieldValidation) {
        this.updateField.validation = 'required'
      } else {
        this.updateField.validation = 'none'
      }

      const filteredChildren = e.children.filter((e) => {
        return e.token === children.token
      })
      if (filteredChildren[0].isUpdateFieldValidation) {
        filteredChildren[0].validation = 'required'
      } else {
        filteredChildren[0].validation = 'none'
      }
    }
  }
}
</script>
