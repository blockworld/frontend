<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="email" class="enter-x">
        <Input size="large" v-model:value="formData.email" :placeholder="t('sys.login.email')" />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <!-- <FormItem class="enter-x" name="policy">
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem> -->

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="enter-x mt-4" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref, computed, toRaw } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useAuth';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'RegisterPasswordForm',
    components: {
      Button,
      Form,
      FormItem: Form.Item,
      Input,
      InputPassword: Input.Password,

      StrengthMeter,

      LoginFormTitle,
    },
    setup() {
      const { t } = useI18n();
      const { notification } = useMessage();
      const { handleBackLogin, getLoginState } = useLoginState();
      const userStore = useUserStore();

      const formRef = ref();
      const loading = ref(false);

      const formData = reactive({
        email: '',
        password: '',
        confirmPassword: '',
        // mobile: '',
        // sms: '',
        // policy: false,
      });

      const { getFormRules } = useFormRules(formData);
      const { validForm } = useFormValid(formRef);

      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

      async function handleRegister() {
        const data = await validForm();
        if (!data) return;

        try {
          loading.value = true;

          const userInfo = await userStore.register(
            toRaw({
              email: formData.email,
              password: formData.password,
            })
          );
          if (userInfo) {
            notification.success({
              message: t('sys.login.registerSuccessTitle'),
              description: `${t('sys.login.registerSuccessDesc')}`,
              duration: 3,
            });
            handleBackLogin();
          }
        } finally {
          loading.value = false;
        }
      }

      return {
        t,
        formRef,
        formData,
        getFormRules,
        handleRegister,
        loading,
        handleBackLogin,
        getShow,
      };
    },
  });
</script>
