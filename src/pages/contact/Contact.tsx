import { Trans, t } from '@lingui/macro'
import { Button, Form, Row, Col } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import apple from '/public/assets/apple-ol.webp'
import useMobile from 'hooks/Mobile'
import { createContactMessage } from 'lib/api/discord'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { JuiceSelect } from 'components/inputs/JuiceSelect'

export default function Contact() {
  const [contactPlaceholder, setContactPlaceholder] = useState<string>(
    'banny@juicebox.money',
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const isMobile = useMobile()

  const [form] = Form.useForm()

  const onFormSubmit = async () => {
    setError(false)
    setSuccess(false)

    try {
      const metadata = {
        name: form.getFieldValue('name'),
        contact: form.getFieldValue('contact'),
        contactPlatform: form.getFieldValue('contactPlatform'),
        subject: form.getFieldValue('subject'),
      }

      setLoading(true)
      await createContactMessage(form.getFieldValue('message'), metadata)

      setSuccess(true)
    } catch (e) {
      setError(true)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (option: string) => {
    const examples = new Map<string, string>([
      ['email', 'banny@juicebox.money'],
      ['discord', 'banny#4200'],
      ['twitter', '@banny'],
      ['telegram', '@banny'],
    ])

    setContactPlaceholder(examples.get(option) ?? 'Your contact')
  }

  const contactTypes = (
    <Form.Item name="contactPlatform" initialValue="email" className="mb-0">
      <JuiceSelect
        className="min-w-[9em]"
        onSelect={handleSelect}
        options={[
          { value: 'email', label: t`Email` },
          { value: 'discord', label: t`Discord` },
          { value: 'twitter', label: t`Twitter` },
          { value: 'telegram', label: t`Telegram` },
        ]}
      />
    </Form.Item>
  )

  return (
    <>
      <div className="mx-auto max-w-5xl px-10">
        <Row align="middle" gutter={40}>
          <Col xs={24} md={14}>
            <h1 className="m-0 my-4 text-4xl font-semibold">
              <Trans>Contact</Trans>
            </h1>
            <p>
              <Trans>
                Message a DAO contributor for feature requests, help planning
                your project, or to have your questions and inquiries answered.
              </Trans>
            </p>
            <Form
              onFinish={onFormSubmit}
              form={form}
              layout="vertical"
              className="max-w-4xl"
            >
              <Form.Item name="name" label={t`Your Name`}>
                <JuiceInput placeholder="Banny the Banana" />
              </Form.Item>
              <Form.Item name="contact" label={t`Where to Contact You`}>
                <JuiceInput
                  addonAfter={contactTypes}
                  placeholder={contactPlaceholder}
                />
              </Form.Item>
              <Form.Item
                name="subject"
                label={t`Subject`}
                initialValue="project help"
              >
                <JuiceSelect
                  options={[
                    {
                      value: 'project help',
                      label: t`Get help planning or configuring my project.`,
                    },
                    { value: 'feature request', label: t`Request a feature.` },
                    {
                      value: 'media inquiry',
                      label: t`I have a media inquiry.`,
                    },
                    { value: 'general question', label: t`I have a question.` },
                    { value: 'other', label: t`Other.` },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="message"
                label={t`Your Message`}
                rules={[{ required: true, message: 'Enter a message.' }]}
              >
                <JuiceTextArea maxLength={500} showCount={true} />
              </Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                <Trans>Send Message</Trans>
              </Button>
            </Form>

            <p>
              {success && (
                <span className="mt-4 text-haze-500">
                  <Trans>Message sent!</Trans>
                </span>
              )}
              {error && (
                <span className="mt-4 text-error-500">
                  <Trans>Failed to send message.</Trans>
                </span>
              )}
            </p>
          </Col>

          {!isMobile && (
            <Col xs={24} md={10}>
              <Image
                src={apple}
                alt="Wise Juicebox apple smoking a cigarette, carrying paperwork, and using a walking cane"
                loading="lazy"
              />
            </Col>
          )}
        </Row>
      </div>
    </>
  )
}
