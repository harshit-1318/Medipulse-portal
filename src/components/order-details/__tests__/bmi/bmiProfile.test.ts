import { describe, expect, it } from "vitest";
import { getBmiProfileFromProduct, hasProvidedEthnicityAnswer } from "../../sections/bmi/utils/bmiProfile";

describe("bmiProfile utilities", () => {
    describe("getBmiProfileFromProduct", () => {
        it.each([
            ["Asian or Asian British", "ethnicity-adjusted"],
            ["Black, African, Caribbean or Black British", "ethnicity-adjusted"],
            ["Middle Eastern", "ethnicity-adjusted"],
            ["Mixed or multiple ethnicities (including Asian, Black or Middle Eastern backgrounds)", "ethnicity-adjusted"],
            ["African-Caribbean", "ethnicity-adjusted"],
            ["White (including White British, White Irish, and other White backgrounds)", "standard"],
            ["Other ethnic group", "standard"],
            ["Prefer not to say", "standard"],
            ["White British", "standard"],
        ])("determines profile for %s -> %s", (ethnicity, expected) => {
            const product = { consultationQuestions: [{ name: "What is your ethnicity?", value: ethnicity }] };
            expect(getBmiProfileFromProduct(product)).toBe(expected);
        });

        it("returns ethnicity-adjusted when specific family background question is yes", () => {
            const product = { consultationQuestions: [{ name: "Are you from a Middle Eastern family background?", value: "Yes" }] };
            expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
        });

        it("returns standard profile when product is missing", () => {
            expect(getBmiProfileFromProduct(undefined)).toBe("standard");
        });
    });

    describe("hasProvidedEthnicityAnswer", () => {
        it("returns true when ethnicity question has a value", () => {
            const product = { consultationQuestions: [{ name: "What is your ethnicity?", value: "Prefer not to say" }] };
            expect(hasProvidedEthnicityAnswer(product)).toBe(true);
        });

        it("returns false when no ethnicity question exists or product is missing", () => {
            expect(hasProvidedEthnicityAnswer({ consultationQuestions: [{ name: "Are you over 18?", value: "Yes" }] })).toBe(false);
            expect(hasProvidedEthnicityAnswer(undefined)).toBe(false);
        });
    });
});
