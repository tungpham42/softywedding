import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, legalListClassName } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms that apply when using Softy Wedding to plan weddings, publish wedding websites, manage invitations, and submit RSVPs.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="These terms explain the ground rules for using Softy Wedding to organize wedding details, create invitations, publish a wedding website, and respond to an invitation."
    >
      <LegalSection title="1. Agreement to these terms">
        <p>
          These Terms & Conditions (“Terms”) apply to your access to and use of
          the Softy Wedding website, planning workspaces, public wedding pages,
          invitation features, and RSVP tools (the “Service”). By using the
          Service, you agree to these Terms. If you do not agree, do not use the
          Service.
        </p>
        <p>
          “You” means the person using the Service. “We,” “us,” and “our” refer
          to the operator of the Softy Wedding deployment you are using.
        </p>
      </LegalSection>

      <LegalSection title="2. The Service">
        <p>
          Softy Wedding provides tools for couples and wedding planners to
          organize wedding details, manage planning tasks, create invitation
          codes, collect guest RSVPs, and publish wedding websites. Guests may
          use invitation lookup and RSVP features made available for a wedding.
        </p>
        <p>
          Features may change, become temporarily unavailable, or differ by
          deployment. We may maintain, improve, replace, or discontinue parts of
          the Service, subject to applicable law.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts and access">
        <ul className={legalListClassName}>
          <li>You must be legally able to use the Service and provide accurate information when creating or using an account.</li>
          <li>Sign-in may be provided through Google and Firebase Authentication. Your use of those services may also be subject to their terms.</li>
          <li>You are responsible for keeping control of your account and for activity performed through it. Notify the service operator if you suspect unauthorized access.</li>
          <li>Couples and planners must only access wedding workspaces and guest information they are authorized to manage. Planner access may be assigned by the wedding owner.</li>
          <li>Do not attempt to bypass access controls, probe or disrupt the Service, or use another person’s account or invitation credentials without permission.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Your content and permissions">
        <p>
          You retain any rights you have in names, text, photographs, schedules,
          tasks, design choices, and other material you submit (“Your Content”).
          You are responsible for Your Content and must have the rights and
          permissions needed to upload, store, use, and publish it through the
          Service.
        </p>
        <p>
          You give the Service operator a limited, non-exclusive permission to
          host, store, reproduce, process, and display Your Content only as
          reasonably needed to operate, secure, and provide the features you
          select, including displaying a wedding website when you publish it.
          This permission ends when the content is removed from the Service,
          except for copies retained temporarily in backups or as required for
          legal, security, or operational purposes.
        </p>
        <p>
          Do not upload content that infringes another person’s rights, violates
          the law, is deceptive or abusive, or contains private information you
          are not authorized to share.
        </p>
      </LegalSection>

      <LegalSection title="5. Published wedding websites and invitations">
        <p>
          The wedding owner is responsible for reviewing a page before
          publishing it. Once published, the information and images selected for
          the public page may be viewable by anyone with access to its URL. You
          should unpublish a page or remove content you no longer want displayed.
        </p>
        <p>
          Invitation links and codes help guests find the right event. Treat
          them like private links, share them only with intended guests, and
          request that the organizer deactivate an invitation if it is
          misplaced or shared with the wrong person. We cannot guarantee that a
          link or code will remain confidential after it has been shared.
        </p>
      </LegalSection>

      <LegalSection title="6. Guest information and RSVPs">
        <p>
          Guests should provide accurate RSVP information and submit responses
          only for themselves or for guests they are authorized to represent.
          Couples and planners are responsible for using RSVP information
          appropriately and for informing guests how their information will be
          used when required by law.
        </p>
        <p>
          The Service helps record and organize responses; it does not verify
          every response or guarantee that guests will attend. Contact the
          wedding organizer to correct an RSVP or resolve questions about the
          event. The organizer is responsible for decisions based on the
          information collected through the Service.
        </p>
      </LegalSection>

      <LegalSection title="7. Acceptable use">
        <p>You agree not to:</p>
        <ul className={legalListClassName}>
          <li>use the Service for an unlawful, fraudulent, harassing, or harmful purpose;</li>
          <li>submit false RSVP information or create invitations to mislead or abuse others;</li>
          <li>upload malware, attempt unauthorized access, interfere with normal operation, or circumvent security controls;</li>
          <li>scrape, copy, or use personal information from the Service in a way that violates privacy, these Terms, or applicable law; or</li>
          <li>infringe intellectual-property, privacy, publicity, or other rights belonging to another person.</li>
        </ul>
        <p>
          We may investigate suspected misuse and restrict or suspend access
          where reasonably necessary to protect users, data, and the Service or
          to comply with law.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-party providers">
        <p>
          The Service relies on third-party services for certain functions,
          including Firebase/Google for authentication and data storage and
          Cloudinary for some image uploads. Analytics tools may also be enabled
          by the deployment operator. Third-party services are governed by their
          own terms and policies, and their availability is not controlled
          entirely by us.
        </p>
      </LegalSection>

      <LegalSection title="9. No wedding or vendor guarantee">
        <p>
          Softy Wedding is a planning and coordination tool, not a wedding
          venue, caterer, photographer, travel provider, or event-management
          professional. We do not book vendors, verify venue details, guarantee
          that event information is accurate, or promise that a wedding will
          take place as described. Couples, planners, guests, and vendors remain
          responsible for confirming arrangements directly with one another.
        </p>
      </LegalSection>

      <LegalSection title="10. Availability and disclaimers">
        <p>
          We work to keep the Service useful and available, but we do not promise
          uninterrupted or error-free operation, that every record will always
          be available, or that the Service will meet every requirement. Keep
          copies of important event information and verify time-sensitive
          arrangements independently.
        </p>
        <p>
          To the extent permitted by applicable law, the Service is provided on
          an “as available” basis and implied warranties are disclaimed where
          they may lawfully be excluded. Nothing in these Terms excludes a
          warranty, right, or remedy that cannot legally be excluded.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, the Service
          operator will not be liable for indirect, incidental, special,
          consequential, or punitive loss, or for loss arising from inaccurate
          user-submitted event details, unauthorized sharing of invitation
          links, third-party service interruptions, or a guest’s decision not to
          attend.
        </p>
        <p>
          Nothing in these Terms limits liability or remedies that applicable
          law does not allow to be limited. Any limitation applies only to the
          extent legally permitted in the jurisdiction relevant to your use of
          the Service.
        </p>
      </LegalSection>

      <LegalSection title="12. Suspension and termination">
        <p>
          You may stop using the Service at any time. We may suspend or restrict
          access when reasonably necessary to address security risks, suspected
          abuse, a violation of these Terms, legal requirements, or operational
          needs. Where appropriate and legally permitted, we will take reasonable
          steps to explain a restriction or resolve the issue.
        </p>
        <p>
          Ending use of the Service does not automatically remove information
          already shared in a published page, copied by another person, or
          retained where required for legitimate legal, security, or backup
          purposes. Contact the service operator for data-related requests.
        </p>
      </LegalSection>

      <LegalSection title="13. Privacy">
        <p>
          Our <Link className="font-semibold text-pine underline decoration-[#c8a66e] underline-offset-4 hover:text-terra" href="/privacy-policy">Privacy Policy</Link>{" "}
          explains how information may be collected, used, and shared when you
          use the Service. By using the Service, you acknowledge that policy.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to these Terms">
        <p>
          We may revise these Terms as the Service or applicable requirements
          change. The “Last updated” date above identifies the current revision.
          Where required, material changes will be communicated or presented for
          acceptance. If you continue to use the Service after revised Terms take
          effect, the revised Terms apply to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="15. Applicable law and contact">
        <p>
          These Terms are subject to applicable law. They do not take away any
          non-waivable rights or consumer protections that apply to you. Any
          dispute should first be raised with the service operator so the parties
          can try to resolve it informally, without limiting rights available
          under applicable law.
        </p>
        <p>
          For questions about these Terms or the Service, contact the Softy
          Wedding operator using the current contact details made available for
          this deployment.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
