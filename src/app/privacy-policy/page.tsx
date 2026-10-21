import type { Metadata } from "next";
import { LegalPage, LegalSection, legalListClassName } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Softy Wedding handles account, wedding-planning, invitation, and RSVP information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Your wedding is personal. This policy explains what information Softy Wedding processes, why it is used, and the choices available to you when planning, publishing, inviting, and responding."
    >
      <LegalSection title="1. About this policy">
        <p>
          This Privacy Policy applies to the Softy Wedding website and its
          wedding-planning workspaces, published wedding websites, invitation
          lookup, and RSVP features (together, the “Service”). It describes how
          information is handled when couples, wedding planners, and invited
          guests use the Service.
        </p>
        <p>
          The person or organization operating a particular Softy Wedding
          deployment is responsible for its operation and for responding to
          privacy requests. Features and third-party integrations may vary by
          deployment.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>Depending on how you use the Service, information may include:</p>
        <ul className={legalListClassName}>
          <li>
            <strong className="text-ink">Account and sign-in information:</strong>{" "}
            your Firebase account identifier and basic profile information made
            available through Google sign-in, such as your name or email
            address.
          </li>
          <li>
            <strong className="text-ink">Wedding and planning information:</strong>{" "}
            partner names, wedding date, venue and location, headline, story,
            ceremony and reception times, schedule items, planning tasks, and
            saved design preferences.
          </li>
          <li>
            <strong className="text-ink">Invitation information:</strong>{" "}
            invitation codes, guest or household names, the associated wedding,
            allowed guest count, and whether an invitation is active.
          </li>
          <li>
            <strong className="text-ink">RSVP information:</strong>{" "}
            a guest’s name and email address, attendance response, party size,
            meal preference, invitation code, and the time the response was
            recorded.
          </li>
          <li>
            <strong className="text-ink">Photos and other content:</strong>{" "}
            images and text you choose to upload or add to a wedding website.
            Wedding cover-image uploads may be processed by Cloudinary.
          </li>
          <li>
            <strong className="text-ink">Technical and usage information:</strong>{" "}
            information processed by the hosting and security infrastructure
            when you access the Service. If analytics integrations are enabled
            for the deployment, related usage and device information may also
            be collected by those tools.
          </li>
        </ul>
        <p>
          Please provide only information that is reasonably needed for the
          wedding or RSVP process. Do not add sensitive personal information to
          a public wedding page.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <p>Information may be used to:</p>
        <ul className={legalListClassName}>
          <li>authenticate users and protect private couple and planner workspaces;</li>
          <li>create and manage wedding details, checklists, schedules, and design settings;</li>
          <li>publish wedding websites when an authorized user chooses to publish them;</li>
          <li>create invitations, verify invitation codes, receive RSVPs, and show response status to the relevant couple or planner;</li>
          <li>process requested cover-image uploads and deliver the Service’s features;</li>
          <li>maintain, troubleshoot, secure, and improve the Service, including measuring usage where analytics tools are enabled; and</li>
          <li>respond to requests, protect users, and comply with applicable legal obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Published pages, invitations, and sharing">
        <p>
          A wedding website is private until its owner publishes it. When a
          wedding is published, the details and media selected for display on
          that page may be visible to anyone who can access its public URL. You
          should review the page before publishing and avoid including anything
          you do not want made public.
        </p>
        <p>
          Invitation links and codes are intended for the guests selected by
          the couple or planner. Anyone who obtains a working invitation link
          or code may be able to access the associated invitation flow, so share
          them thoughtfully and ask the organizer to deactivate a code if it is
          shared unintentionally.
        </p>
        <p>
          RSVP details are used to support attendance tracking and may be
          accessible to the couple or planner managing the relevant wedding.
          Guest information should be provided with the understanding that it is
          being shared with that organizer for wedding-planning purposes.
        </p>
      </LegalSection>

      <LegalSection title="5. When information is shared">
        <p>Information may be shared in these limited circumstances:</p>
        <ul className={legalListClassName}>
          <li>
            <strong className="text-ink">With the wedding organizer:</strong>{" "}
            the couple or an assigned planner can access the wedding information
            and response information needed to manage that wedding.
          </li>
          <li>
            <strong className="text-ink">With service providers:</strong>{" "}
            Firebase and Google services support authentication and data
            storage. Cloudinary may process uploaded cover images. Google
            Analytics or Google Tag Manager may be used if configured by the
            deployment operator. These providers process information under
            their own terms and privacy practices as applicable.
          </li>
          <li>
            <strong className="text-ink">For legal and security reasons:</strong>{" "}
            information may be disclosed when reasonably necessary to comply
            with law, respond to lawful requests, enforce the terms, or protect
            the rights, safety, and security of users or the Service.
          </li>
          <li>
            <strong className="text-ink">At your direction:</strong>{" "}
            information may be shared when you ask us to do so or choose to
            publish it through the Service.
          </li>
        </ul>
        <p>
          The Service is not intended to sell personal information. The operator
          should update this policy if its actual data-sharing practices change.
        </p>
      </LegalSection>

      <LegalSection title="6. Storage, security, and retention">
        <p>
          Wedding records and RSVP submissions are stored using Firebase and
          Cloud Firestore. Some uploaded images may be stored or delivered using
          Cloudinary. These providers may process information in countries other
          than your own, subject to the terms and safeguards applicable to the
          provider and deployment.
        </p>
        <p>
          The Service uses access checks and other reasonable measures intended
          to protect personal information. No website, transmission, or storage
          system can be guaranteed to be completely secure.
        </p>
        <p>
          Information is retained for as long as needed to operate the relevant
          account, wedding, invitation, RSVP, and related records, and for
          legitimate security, dispute-resolution, or legal purposes. Retention
          may vary depending on the deployment and applicable law.
        </p>
      </LegalSection>

      <LegalSection title="7. Your choices and privacy rights">
        <p>
          Depending on applicable law, you may have the right to request access
          to, correction of, or deletion of personal information, or to object to
          or restrict certain processing. You can also ask the wedding organizer
          to correct an RSVP or deactivate an invitation code that they manage.
        </p>
        <p>
          To make a privacy request, contact the operator of the Softy Wedding
          deployment using the contact details it provides. The operator may
          need to verify your identity and may retain some information where
          permitted or required by law. If you are a guest, the couple or planner
          who collected your RSVP may be the most direct contact for correcting
          information associated with that wedding.
        </p>
      </LegalSection>

      <LegalSection title="8. Children’s privacy">
        <p>
          The Service is designed for wedding planning and invitations, not for
          children to create accounts independently. Do not submit a child’s
          personal information unless you are authorized to do so and it is
          appropriate for the event. If you believe information has been
          submitted improperly, contact the service operator.
        </p>
      </LegalSection>

      <LegalSection title="9. Third-party services and external links">
        <p>
          Authentication, hosting, image processing, or analytics may rely on
          third-party services. Their processing is governed by their own
          policies and settings. The Service may also link to websites it does
          not operate; review those websites’ privacy notices before providing
          information to them.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes and contact">
        <p>
          This policy may be updated to reflect changes to the Service, its
          providers, or legal requirements. The “Last updated” date above shows
          the date of the most recent revision. Continued use after an update is
          subject to the revised policy to the extent permitted by applicable
          law.
        </p>
        <p>
          For questions or requests concerning this policy, contact the operator
          using the current contact details made available for the Softy Wedding
          deployment. The operator should publish a monitored privacy contact
          before launching the Service to the public.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
