import { describe, expect, it } from "vitest";
import { getBmiProfileFromProduct, hasProvidedEthnicityAnswer } from "../../sections/bmi/utils/bmiProfile";

describe("getBmiProfileFromProduct", () => {
    it("returns ethnicity-adjusted for website Asian or Asian British option", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Asian or Asian British" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
    });

    it("returns ethnicity-adjusted for website Black/African/Caribbean option", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Black, African, Caribbean or Black British" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
    });

    it("returns ethnicity-adjusted for website Middle Eastern option", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Middle Eastern" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
    });

    it("returns ethnicity-adjusted for website Mixed option with listed backgrounds", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Mixed or multiple ethnicities (including Asian, Black or Middle Eastern backgrounds)" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
    });

    it("returns standard for website White option", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "White (including White British, White Irish, and other White backgrounds)" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("standard");
    });

    it("returns standard for website Other ethnic group option", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Other ethnic group" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("standard");
    });

    it("returns standard for website Prefer not to say option", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Prefer not to say" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("standard");
    });

    it("returns ethnicity-adjusted when ethnicity answer contains adjusted groups", () => {
        const product = {
            consultationQuestions: [
                { name: "Ethnicity", value: "African-Caribbean" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
    });

    it("returns ethnicity-adjusted when specific group question is answered yes", () => {
        const product = {
            consultationQuestions: [
                { name: "Are you from a Middle Eastern family background?", value: "Yes" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("ethnicity-adjusted");
    });

    it("returns standard profile when no adjusted group is present", () => {
        const product = {
            consultationQuestions: [
                { name: "Ethnicity", value: "White British" }
            ]
        };

        expect(getBmiProfileFromProduct(product)).toBe("standard");
    });

    it("returns standard profile when product is missing", () => {
        expect(getBmiProfileFromProduct(undefined)).toBe("standard");
    });
});

describe("hasProvidedEthnicityAnswer", () => {
    it("returns true when ethnicity question has a value", () => {
        const product = {
            consultationQuestions: [
                { name: "What is your ethnicity?", value: "Prefer not to say" }
            ]
        };

        expect(hasProvidedEthnicityAnswer(product)).toBe(true);
    });

    it("returns false when no ethnicity question exists", () => {
        const product = {
            consultationQuestions: [
                { name: "Are you over 18?", value: "Yes" }
            ]
        };

        expect(hasProvidedEthnicityAnswer(product)).toBe(false);
    });

    it("returns false when product is missing", () => {
        expect(hasProvidedEthnicityAnswer(undefined)).toBe(false);
    });
});
