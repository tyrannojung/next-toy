module.exports = {
    root: true, // ESLint는 이 구성 파일이 위치한 디렉토리를 설정의 루트로 간주하고 상위 디렉토리의 설정 파일을 더 이상 참조하지 않음
    parser: "@typescript-eslint/parser", // "@typescript-eslint/parser"를 사용하여 ESLint가 TypeScript 코드를 올바르게 분석할 수 있도록 설정
    parserOptions: { // 코드를 분석할 때 사용하는 옵션을 정의
        ecmaVersion: 2017, // ECMAScript 버전을 2017로 설정하여 해당 버전의 문법을 지원
        ecmaFeatures: { // 추가 ECMAScript 기능을 활성화하는 옵션으로, 여기서는 JSX 문법을 활성화
            jsx: true,
        },
    },
    env: { // 코드가 실행될 환경을 정의합니다. 여기서는 ECMAScript 6 버전과 브라우저 환경을 활성화하여 관련 전역 변수를 인식하도록 설정
        es6: true,
        browser: true,
    },
    settings: { // 모듈 해석 방법을 설정합니다. 주로 import 문에서 파일 확장자 해석에 사용되는 옵션을 설정
        "import/resolver": {
            node: {
                extensions: [".js", ".ts", ".jsx", ".tsx"],
            },
        },
        "import/extensions": [".js", ".ts", ".jsx", ".tsx"],
    },
    // 다른 ESLint 구성을 상속받습니다. "airbnb", "airbnb/hooks", "prettier", 그리고 "@typescript-eslint/recommended" 규칙 세트를 사용하여 일련의 규칙을 제공
    extends: ["airbnb", "airbnb/hooks", "prettier", "plugin:@typescript-eslint/recommended"],
    
    // 특정 ESLint 규칙을 활성화, 비활성화 또는 수정
    rules: {
        "import/prefer-default-export": 0,
        "react/destructuring-assignment": 0,
        "react/jsx-no-bind": 0,
        "react/no-unused-prop-types": 0,
        // Typescript
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["warn"],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "no-console": ["warn", { allow: ["info", "warn", "error"] }],
        "no-plusplus": 0,
        "prefer-destructuring": ["warn", { object: true, array: false }],
        "no-underscore-dangle": 0,
        // React
        "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
        "react/prop-types": 0,
        "react/jsx-props-no-spreading": 0,
        "react/no-multi-comp": 0,
        "arrow-body-style": 0,
        "prefer-arrow-callback": 0,
        "import/extensions": ["off"],
    },
};
